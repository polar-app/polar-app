/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from './ILogger';

class ConsoleLogger implements ILogger{

    info(...args: any[]) {
        console.log(...args);
    }

    warn(...args: any[]) {
        console.warn(...args);
    }

    error(...args: any[]) {
        console.error(...args);
    }

    verbose(...args: any[]) {
        console.log("VERBOSE: " , ...args);
    }

    debug(...args: any[]) {
        console.log("DEBUG: " , ...args);
    }

}

module.exports.ConsoleLogger = ConsoleLogger;
