#!/usr/bin/env node
/**
 * glamdown CLI — render markdown beautifully in the terminal.
 *
 * Usage:
 *   glamdown <file.md>
 *   cat file.md | glamdown
 *   glamdown --help
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { runApp } from './app.js';

const HELP = `
glamdown — Terminal Markdown Renderer

Usage:
  glamdown <file.md>       Render a markdown file
  cat file.md | glamdown   Read from stdin
  glamdown --help           Show this help

Navigation:
  j / ↓           Scroll down
  k / ↑           Scroll up
  Space / PgDn    Page down
  PgUp            Page up
  g / Home        Go to top
  G / End         Go to bottom
  q / Esc         Quit
`.trim();

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(HELP);
    process.exit(0);
  }

  let source: string;
  let filename: string;

  if (args.length > 0) {
    // Read from file
    const filePath = path.resolve(args[0]!);
    filename = path.basename(filePath);

    try {
      source = fs.readFileSync(filePath, 'utf-8');
    } catch (err: unknown) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        process.stderr.write(`Error: File not found: ${filePath}\n`);
      } else if (code === 'EACCES') {
        process.stderr.write(`Error: Permission denied: ${filePath}\n`);
      } else {
        process.stderr.write(`Error: Could not read file: ${filePath}\n`);
      }
      process.exit(1);
    }
  } else if (!process.stdin.isTTY) {
    // Read from stdin
    filename = 'stdin';
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer);
    }
    source = Buffer.concat(chunks).toString('utf-8');
  } else {
    // No file and no piped input
    console.log(HELP);
    process.exit(1);
  }

  if (source.trim().length === 0) {
    process.stderr.write('Error: Empty input\n');
    process.exit(1);
  }

  await runApp(source, filename);
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${err}\n`);
  process.exit(1);
});
