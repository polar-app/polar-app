/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from './ILogger';
import {Toaster} from '../toaster/Toaster';

/**
 * Creates a toast when when an error or a warning is displayed. No other
 * messages are displayed though because it would be silly to render them
 * otherwise.
 */
export class ToasterLogger implements ILogger {

    readonly name: string = 'toaster-logger';

    warn(msg: string, ...args: any[]) {
        Toaster.warning(msg)
    }

    error(msg: string, ...args: any[]) {
        Toaster.error(msg)
    }

    info(msg: string, ...args: any[]) {
    }

    verbose(msg: string, ...args: any[]) {
    }

    debug(msg: string, ...args: any[]) {
    }

}
