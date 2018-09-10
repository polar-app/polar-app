/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from './ILogger';
import {ElectronLoggers} from './ElectronLogger';

/**
 * A logger which writes to disk but ONLY if they are errors.  This is needed for
 * performance reasons as electron-log isn't amazingly fast.
 */
export class PersistentErrorLogger implements ILogger {

    public readonly name: string = 'persistent-error-logger';

    public error(msg: string, ...args: any[]) {
        PersistentErrorLogger.delegate.error(msg, ...args);
    }

    public info(msg: string, ...args: any[]) {
        // noop
    }

    public warn(msg: string, ...args: any[]) {
        // noop
    }

    public verbose(msg: string, ...args: any[]) {
        // noop
    }

    public debug(msg: string, ...args: any[]) {
        // noop
    }

    private static delegate = ElectronLoggers.create();

}
