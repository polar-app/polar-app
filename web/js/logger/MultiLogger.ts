/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from './ILogger';

/**
 * Allows us to log to multiple delegates at once.
 */
export class MultiLogger implements ILogger {

    public readonly name: string ;

    private readonly delegates: ILogger[];

    constructor(...delegates: ILogger[]) {
        this.delegates = delegates;

        this.name = 'multi-logger|'
            + this.delegates.map(delegate => delegate.name).join("+");
    }

    public warn(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.warn(msg, ...args));
    }

    public error(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.error(msg, ...args));
    }

    public info(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.info(msg, ...args));
    }

    public verbose(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.verbose(msg, ...args));
    }

    public debug(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.debug(msg, ...args));
    }

    public async sync(): Promise<void> {

        for (const delegate of this.delegates) {
            await delegate.sync();
        }

    }

}
