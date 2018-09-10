/**
 * Logging interface.
 */
export interface ILogger {

    /**
     * The name of this logger for debug purposes.
     */
    readonly name: string;

    info(msg: string, ...args: any[]): void;

    warn(msg: string, ...args: any[]): void;

    error(msg: string, ...args: any[]): void;

    verbose(msg: string, ...args: any[]): void;

    debug(msg: string, ...args: any[]): void;

    sync(): Promise<void>;

}

