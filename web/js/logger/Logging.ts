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
import {FilePaths} from '../util/FilePaths';

/**
 * Maintains our general logging infrastructure.  Differentiated from Logger
 * which performs the actual logging of message. This maintains Loggers.
 */
export class Logging {

    /**
     * Initialize the logger to write to a specific directory.
     */
    public static async init() {

        const target: ILogger = await this.createTarget();

        await this.initWithTarget(target);

    }

    public static async initWithTarget(target: ILogger) {

        const loggingConfig = await this.loggingConfig();

        const delegate =
            new FilteredLogger(
                new VersionAnnotatingLogger(
                    new LevelAnnotatingLogger(target)), loggingConfig.level);

        LoggerDelegate.set(delegate);

        const logger = LoggerDelegate.get();

        // noinspection TsLint: max-line-length
        logger.info(`Using logger: ${logger.name}: target=${loggingConfig.target}, level=${LogLevel[loggingConfig.level]}`);

    }

    public static async createTarget(): Promise<ILogger> {

        const loggers: ILogger[] = [];

        loggers.push(new SentryLogger());
        loggers.push(await this.createPrimaryTarget());

        return new MultiLogger(...loggers);

    }

    public static async createPrimaryTarget(): Promise<ILogger> {

        const loggingConfig = await this.loggingConfig();

        if (loggingConfig.target === LoggerTarget.CONSOLE) {
            return new ConsoleLogger();
        // } else if(loggerTarget === LoggerTarget.DISK) {
        //     let directories = new Directories();
        //     return await ElectronLoggers.create(directories.logsDir);
        } else {
            throw new Error("Invalid target: " + loggingConfig.target);
        }

    }

    private static async loggingConfig(): Promise<LoggingConfig> {

        const directories = await new Directories().init();

        const path = FilePaths.join(directories.configDir, 'logging.json');

        if (await Files.existsAsync(path)) {

            const buffer = await Files.readFileAsync(path);
            const json = buffer.toString('utf8');
            let config = JSON.parse(json) as LoggingConfig;

            if (typeof config.level === 'string') {

                // needed to convert the symbol back to the enum.  Not sure
                // this is very clean though and wish there was a better way
                // to do this.

                config = { level: LogLevels.fromName(config.level),
                           target: config.target };

            }

            return config;

        }

        return {

            target: LoggerTarget.CONSOLE,

            level: Optional.of(process.env.POLAR_LOG_LEVEL)
                    .map(level => LogLevels.fromName(level))
                    .getOrElse(LogLevel.WARN)
        };

    }

}

enum LoggerTarget {
    CONSOLE = 'CONSOLE',
    // DISK = 'DISK'
}

/**
 * Basic disk config for our log information.
 */
export interface LoggingConfig {
    readonly target: LoggerTarget;
    readonly level: LogLevel;
}
