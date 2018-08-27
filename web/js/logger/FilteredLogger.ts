import {ILogger} from './ILogger';
import {LogLevel} from './LogLevel';

export class FilteredLogger implements ILogger {

    private readonly delegate: ILogger;

    public readonly level: LogLevel;

    public readonly name: string;

    constructor(delegate: ILogger, level: LogLevel = LogLevel.INFO) {
        this.delegate = delegate;
        this.level = level;
        this.name = delegate.name + '(filtered)';
    }

    debug(msg: string, ...args: any[]) {
        if(this.level < LogLevel.DEBUG) return;
        this.delegate.debug(msg, ...args);
    }

    verbose(msg: string, ...args: any[]) {
        if(this.level < LogLevel.VERBOSE) return;
        this.delegate.verbose(msg, ...args);
    }

    info(msg: string, ...args: any[]) {
        if(this.level < LogLevel.INFO) return;
        this.delegate.info(msg, ...args);
    }

    warn(msg: string, ...args: any[]) {
        if(this.level < LogLevel.WARN) return;
        this.delegate.warn(msg, ...args);
    }

    error(msg: string, ...args: any[]) {
        if(this.level < LogLevel.ERROR) return;
        this.delegate.error(msg, ...args);
    }

}
