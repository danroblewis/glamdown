FROM node:20

ARG TZ=America/Los_Angeles
ARG CLAUDE_CODE_VERSION=latest
ARG GIT_DELTA_VERSION=0.18.2
ARG ZSH_IN_DOCKER_VERSION=1.2.0

ENV TZ=${TZ} \
    DEVCONTAINER=true \
    EDITOR=nano \
    VISUAL=nano

# Install base development tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    sudo \
    git \
    zsh \
    vim \
    nano \
    curl \
    wget \
    jq \
    iputils-ping \
    iproute2 \
    net-tools \
    ca-certificates \
    gnupg \
    # Chromium dependencies for browser testing
    chromium \
    chromium-sandbox \
    fonts-liberation \
    fonts-noto-color-emoji \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    # Python
    python3 \
    python3-pip \
    python3-venv \
    # Virtual display for headed browser testing
    xvfb \
    xauth \
    && rm -rf /var/lib/apt/lists/*

# Set up node user with sudo
RUN echo "node ALL=(ALL) NOPASSWD: /usr/local/bin/init-firewall.sh" >> /etc/sudoers.d/node-firewall \
    && chmod 0440 /etc/sudoers.d/node-firewall

# Create workspace and config directories
RUN mkdir -p /workspace /commandhistory /home/node/.claude \
    && chown -R node:node /workspace /commandhistory /home/node/.claude

# Persist bash history
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
    && mkdir -p /commandhistory \
    && touch /commandhistory/.bash_history \
    && chown -R node:node /commandhistory \
    && echo "$SNIPPET" >> /home/node/.bashrc

# Install git-delta for better diffs
RUN ARCH=$(dpkg --print-architecture) \
    && curl -fsSL "https://github.com/dandavison/delta/releases/download/${GIT_DELTA_VERSION}/git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" -o /tmp/git-delta.deb \
    && dpkg -i /tmp/git-delta.deb \
    && rm /tmp/git-delta.deb

# Install zsh-in-docker
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v${ZSH_IN_DOCKER_VERSION}/zsh-in-docker.sh)" -- \
    -t robbyrussell \
    -p git \
    -p fzf

# Configure npm global path
ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$NPM_CONFIG_PREFIX/bin:$PATH
ENV NODE_PATH=$NPM_CONFIG_PREFIX/lib/node_modules

# Install Claude Code CLI and Playwright globally
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION} playwright

# Download Playwright browsers (as node user for correct permissions)
USER node
RUN npx playwright install chromium
USER root

# Set Chromium env vars for Puppeteer/Playwright compatibility
ENV CHROME_PATH=/usr/bin/chromium \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PLAYWRIGHT_BROWSERS_PATH=/home/node/.cache/ms-playwright

# Copy firewall script
COPY init-firewall.sh /usr/local/bin/init-firewall.sh
RUN chmod +x /usr/local/bin/init-firewall.sh

# Install Rust (as node user so it goes in their home dir)
USER node
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/home/node/.cargo/bin:$PATH"
USER root

# Default shell
ENV SHELL=/bin/zsh
USER node
WORKDIR /workspace
