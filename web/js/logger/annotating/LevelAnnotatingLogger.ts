/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from '../ILogger';

/**
 * Annotates log calls with the level.  Helpful when the target is the
 * console logger.
 */
export class LevelAnnotatingLogger implements ILogger {

    public readonly name: string;
    private readonly delegate: ILogger;

    constructor(delegate: ILogger) {
        this.delegate = delegate;
        this.name = `level-annotating-logger -> ${delegate.name}`;
    }

    info(msg: string, ...args: any[]) {
        this.delegate.info(`[info] ${msg}`, ...args);
    }

    warn(msg: string, ...args: any[]) {
        this.delegate.warn(`[warn] ${msg}`, ...args);
    }

    error(msg: string, ...args: any[]) {
        this.delegate.error(`[error] ${msg}`, ...args);
    }

    verbose(msg: string, ...args: any[]) {
        this.delegate.verbose(`[verbose] ${msg}`, ...args);
    }

    debug(msg: string, ...args: any[]) {
        this.delegate.debug(`[debug] ${msg}`, ...args);
    }

}
