import {LoggerDelegate} from './LoggerDelegate';
import {FilteredLogger} from './FilteredLogger';
import {ConsoleLogger} from './ConsoleLogger';
import {LevelAnnotatingLogger} from './annotating/LevelAnnotatingLogger';
import {VersionAnnotatingLogger} from './annotating/VersionAnnotatingLogger';
import {ILogger} from './ILogger';
import {Directories} from '../datastore/Directories';
import {LogLevel} from './LogLevel';
import {Files} from '../util/Files';
import {LogLevels} from './LogLevels';
import {Optional} from '../util/ts/Optional';
import {MultiLogger} from './MultiLogger';
import {SentryLogger} from './SentryLogger';
import {Paths} from '../util/Paths';

/**
 * Maintains our general logging infrastructure.  Differentiated from Logger
 * which performs the actual logging of message. This maintains Loggers.
 */
export class Logging {

    /**
     * Initialize the logger to write to a specific directory.
     */
    public static async init() {

        let target: ILogger = await this.createTarget();

        await this.initWithTarget(target);

    }

    public static async initWithTarget(target: ILogger) {

        let loggingConfig = await this.loggingConfig();

        let delegate =
            new FilteredLogger(
                new VersionAnnotatingLogger(
                    new LevelAnnotatingLogger(target)), loggingConfig.level);

        LoggerDelegate.set(delegate);

        let logger = LoggerDelegate.get();
        logger.info(`Using logger: ${logger.name}: target=${loggingConfig.target}, level=${LogLevel[loggingConfig.level]}`);

    }

    public static async createTarget(): Promise<ILogger> {

        return new MultiLogger(new SentryLogger(), await this.createPrimaryTarget());

    }

    public static async createPrimaryTarget(): Promise<ILogger> {

        let loggingConfig = await this.loggingConfig();

        if(loggingConfig.target === LoggerTarget.CONSOLE) {
            return new ConsoleLogger();
        // } else if(loggerTarget === LoggerTarget.DISK) {
        //     let directories = new Directories();
        //     return await ElectronLoggers.create(directories.logsDir);
        } else {
            throw new Error("Invalid target: " + loggingConfig.target);
        }

    }

    private static async loggingConfig(): Promise<LoggingConfig> {

        let directories = await new Directories().init();

        let path = Paths.join(directories.configDir, 'logging.json');

        if(await Files.existsAsync(path)) {

            let buffer = await Files.readFileAsync(path);
            let json = buffer.toString('utf8');
            let config = <LoggingConfig>JSON.parse(json);

            if(typeof config.level === 'string') {

                // needed to convert the symbol back to the enum.  Not sure
                // this is very clean though and wish there was a better way
                // to do this.

                config = { level: LogLevels.fromName(config.level),
                           target: config.target }

            }

            return config;

        }

        return {

            target: LoggerTarget.CONSOLE,

            level: Optional.of(process.env['POLAR_LOG_LEVEL'])
                    .map(level => LogLevels.fromName(level))
                    .getOrElse(LogLevel.WARN)
        };

    }

}

enum LoggerTarget {
    CONSOLE = 'CONSOLE',
    //DISK = 'DISK'
}

/**
 * Basic disk config for our log information.
 */
export interface LoggingConfig {
    readonly target: LoggerTarget;
    readonly level: LogLevel;
}
