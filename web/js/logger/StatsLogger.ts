import {ILogger} from './ILogger';

/**
 * Does nothing other than collect stats on which methods were called for
 * testing purposes.
 */
export class StatsLogger implements ILogger {

    public readonly name: string = "stats";

    public readonly stats = new FilteredStats();

    debug(msg: string, ...args: any[]) {
        ++this.stats.debug;
    }

    verbose(msg: string, ...args: any[]) {
        ++this.stats.verbose;
    }

    info(msg: string, ...args: any[]) {
        ++this.stats.info;
    }

    warn(msg: string, ...args: any[]) {
        ++this.stats.warn;
    }

    error(msg: string, ...args: any[]) {
        ++this.stats.error;
    }

}

export class FilteredStats {
    public debug: number = 0;
    public verbose: number = 0;
    public info: number = 0;
    public warn: number = 0;
    public error: number = 0;
}
