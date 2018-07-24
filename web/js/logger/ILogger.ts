/**
 * Logging interface.
 */
export interface ILogger {

    info(...args: any[]): void;

    warn(...args: any[]): void;

    error(...args: any[]): void;

    verbose(...args: any[]): void;

    debug(...args: any[]): void;

}

