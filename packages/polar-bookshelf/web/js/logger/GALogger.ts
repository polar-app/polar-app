import {ILogger} from 'polar-shared/src/logger/ILogger';
import {RendererAnalytics} from '../ga/RendererAnalytics';
import {GALoggers} from './GALoggers';

/**
 * Logs errors as custom events within GA.
 */
export class GALogger implements ILogger {

    public readonly name: string = 'ga-logger';

    public notice(msg: string, ...args: readonly any[]) {
        // noop
    }

    public warn(msg: string, ...args: readonly any[]) {
        // noop
    }

    public error(msg: string, ...args: readonly any[]) {

        const error = GALoggers.getError(args);

        const event = GALoggers.toEvent(error);

        if (event) {
            RendererAnalytics.event(event);
        }

    }

    public info(msg: string, ...args: readonly any[]) {
        // noop
    }

    public verbose(msg: string, ...args: readonly any[]) {
        // noop
    }

    public debug(msg: string, ...args: readonly any[]) {
        // noop
    }

    public async sync(): Promise<void> {
        // noop
    }

}

