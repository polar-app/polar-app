/**
 * Logging interface.
 */
export interface ILogger {

    info(msg: string, ...args: any[]): void;

    warn(msg: string, ...args: any[]): void;

    error(msg: string, ...args: any[]): void;

    verbose(msg: string, ...args: any[]): void;

    debug(msg: string, ...args: any[]): void;

}

