/**
 * Input handling — keyboard navigation for the viewer.
 */

import type { KeyEvent } from 'blecsd/terminal';
import { type ViewerState, render } from './app.js';

export function setupInput(state: ViewerState): void {
  const { program, inputHandler, rows } = state;
  const viewHeight = rows - 2;

  function clampScroll(): void {
    const maxScroll = Math.max(0, state.lines.length - viewHeight);
    state.scrollY = Math.max(0, Math.min(state.scrollY, maxScroll));
  }

  function scrollAndRender(delta: number): void {
    state.scrollY += delta;
    clampScroll();
    render(state);
  }

  inputHandler.onKey((event: KeyEvent) => {
    const { name, ctrl, shift } = event;

    // Quit
    if (
      name === 'q' ||
      name === 'escape' ||
      (ctrl && name === 'c')
    ) {
      inputHandler.stop();
      program.destroy();
      process.exit(0);
    }

    // Scroll down
    if (name === 'down' || name === 'j') {
      scrollAndRender(1);
      return;
    }

    // Scroll up
    if (name === 'up' || name === 'k') {
      scrollAndRender(-1);
      return;
    }

    // Page down
    if (name === 'pagedown' || name === 'space' || (ctrl && name === 'd')) {
      scrollAndRender(viewHeight);
      return;
    }

    // Page up
    if (name === 'pageup' || (ctrl && name === 'u')) {
      scrollAndRender(-viewHeight);
      return;
    }

    // Home / top
    if (name === 'home' || name === 'g') {
      state.scrollY = 0;
      render(state);
      return;
    }

    // End / bottom (G = shift+g)
    if (name === 'end' || (shift && name === 'g')) {
      state.scrollY = Math.max(0, state.lines.length - viewHeight);
      render(state);
      return;
    }
  });
}
