/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from './ILogger';

/**
 * Allows us to log to multiple delegates at once.
 */
export class MultiLogger implements ILogger {

    readonly name: string ;

    private readonly delegates: ILogger[];

    constructor(delegates: ILogger[]) {
        this.delegates = delegates;

        this.name = 'multi-logger|'
            + this.delegates.map(delegate => delegate.name).join("+");
    }

    warn(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.warn(msg, ...args));
    }

    error(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.error(msg, ...args));
    }

    info(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.info(msg, ...args));
    }

    verbose(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.verbose(msg, ...args));
    }

    debug(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.debug(msg, ...args));
    }

}
