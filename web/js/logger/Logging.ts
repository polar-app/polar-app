import {LoggerDelegate} from './LoggerDelegate';
import {FilteredLogger} from './FilteredLogger';
import {ConsoleLogger} from './ConsoleLogger';
import {LevelAnnotatingLogger} from './annotating/LevelAnnotatingLogger';
import {VersionAnnotatingLogger} from './annotating/VersionAnnotatingLogger';

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

        //let directories = new Directories();
        //let delegate = await ElectronLoggers.create(directories.logsDir);

        let delegate =
            new FilteredLogger(
                new VersionAnnotatingLogger(
                    new LevelAnnotatingLogger(
                        new ConsoleLogger())));

        LoggerDelegate.set(delegate);
        this.initialized = true;

        let logger = LoggerDelegate.get();
        logger.info("Using logger: " + logger.name);

    }

}
