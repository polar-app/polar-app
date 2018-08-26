import {Directories} from '../datastore/Directories';
import {ElectronLoggers} from './ElectronLogger';
import {LoggerDelegate} from './LoggerDelegate';

/**
 * Maintains our general logging infrastructure.  Differentiated from Logger
 * which performs the actual logging of message. This maintains Loggers.
 */
export class Logging {

    private static initialized: boolean = false;

    /**
     * Initialize the logger to write to a specific directory.
     */
    static async init() {

        let directories = new Directories();

        LoggerDelegate.set(await ElectronLoggers.create(directories.logsDir));
        this.initialized = true;

    }

}
