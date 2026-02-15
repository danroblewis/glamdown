/**
 * Application setup — uses blECSd program for terminal I/O and parseTags for styling.
 * Renders content directly to the terminal with manual scrolling.
 */
import { type Program, type InputHandler } from 'blecsd/terminal';
export interface ViewerState {
    scrollY: number;
    lines: string[];
    program: Program;
    inputHandler: InputHandler;
    cols: number;
    rows: number;
    filename: string;
}
/** Render the visible portion of content to the terminal */
export declare function render(state: ViewerState): void;
export declare function runApp(source: string, filename: string): Promise<void>;
