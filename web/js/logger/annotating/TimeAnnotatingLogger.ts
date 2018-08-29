/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from '../ILogger';

/**
 * Annotates logs by including the time.
 */
export class TimeAnnotatingLogger implements ILogger {

    public readonly name: string;
    private readonly delegate: ILogger;

    constructor(delegate: ILogger) {
        this.delegate = delegate;
        this.name = `annotating-logger -> ${delegate.name}`;
    }

    info(msg: string, ...args: any[]) {
        this.delegate.info(this.createTimestamp() + `: ${msg}`, ...args);
    }

    warn(msg: string, ...args: any[]) {
        this.delegate.warn(this.createTimestamp() + `: ${msg}`, ...args);
    }

    error(msg: string, ...args: any[]) {
        this.delegate.error(this.createTimestamp() + `: ${msg}`, ...args);
    }

    verbose(msg: string, ...args: any[]) {
        this.delegate.verbose(this.createTimestamp() + `: ${msg}`, ...args);
    }

    debug(msg: string, ...args: any[]) {
        this.delegate.debug(this.createTimestamp() + `: ${msg}`, ...args);
    }

    private createTimestamp() {
        return new Date().toUTCString();
    }

}
