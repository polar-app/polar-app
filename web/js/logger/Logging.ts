import {LoggerDelegate} from './LoggerDelegate';
import {FilteredLogger} from './FilteredLogger';
import {ConsoleLogger} from './ConsoleLogger';
import {LevelAnnotatingLogger} from './annotating/LevelAnnotatingLogger';

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

        let consoleDelegate = new ConsoleLogger();
        let annotatingLogger = new LevelAnnotatingLogger(consoleDelegate);
        let filteredDelegate = new FilteredLogger(annotatingLogger);

        LoggerDelegate.set(filteredDelegate);
        this.initialized = true;

        let logger = LoggerDelegate.get();
        logger.info("Using logger: " + logger.name);

    }

}
