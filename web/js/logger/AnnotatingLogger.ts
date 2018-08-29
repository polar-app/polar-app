/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from './ILogger';

/**
 * Annotates log calls with the level.  Helpful when the target is the
 * console logger.
 */
export class AnnotatingLogger implements ILogger {

    public readonly name: string;
    private readonly delegate: ILogger;

    constructor(delegate: ILogger) {
        this.delegate = delegate;
        this.name = `annotating-logger -> ${delegate.name}`;
    }

    info(msg: string, ...args: any[]) {
        this.delegate.info(msg, "[info] ", ...args);
    }

    warn(msg: string, ...args: any[]) {
        this.delegate.warn(msg, "[warn] ", ...args);
    }

    error(msg: string, ...args: any[]) {
        this.delegate.error(msg, "[error] ", ...args);
    }

    verbose(msg: string, ...args: any[]) {
        this.delegate.verbose(msg, "[verbose] ", ...args);
    }

    debug(msg: string, ...args: any[]) {
        this.delegate.debug(msg, "[debug]" , ...args);
    }

}
