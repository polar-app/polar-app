import {Directories} from '../datastore/Directories';
import {ElectronLoggers} from './ElectronLogger';
import {LoggerDelegate} from './LoggerDelegate';
import {FilteredLogger} from './FilteredLogger';

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

        let delegate = await ElectronLoggers.create(directories.logsDir);

        delegate = new FilteredLogger(delegate);

        LoggerDelegate.set(delegate);
        this.initialized = true;

    }

}
