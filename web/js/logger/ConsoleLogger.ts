/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from './ILogger';

export class ConsoleLogger implements ILogger {

    info(msg: string, ...args: any[]) {
        console.log(msg, ...args);
    }

    warn(msg: string, ...args: any[]) {
        console.warn(msg, ...args);
    }

    error(msg: string, ...args: any[]) {
        console.error(msg, ...args);
    }

    verbose(msg: string, ...args: any[]) {
        console.log(msg, " VERBOSE: ", ...args);
    }

    debug(msg: string, ...args: any[]) {
        console.log(msg, " DEBUG: " , ...args);
    }

}
