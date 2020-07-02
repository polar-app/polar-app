import {ILogger} from 'polar-shared/src/logger/ILogger';

import { init, captureException } from '@sentry/browser';

let initialized: boolean = false;

// true when sentry is ready for logging.
let ready: boolean = false;

export class SentryBrowserLogger implements ILogger {

    public readonly name: string = 'sentry-browser-logger';

    public notice(msg: string, ...args: any[]) {
        SentryBrowserLogger.initWhenNecessary();
    }

    public warn(msg: string, ...args: any[]) {
        SentryBrowserLogger.initWhenNecessary();
    }

    public error(msg: string, ...args: any[]) {

        SentryBrowserLogger.initWhenNecessary();

        if (ready) {

            args.forEach(arg => {

                if ( arg instanceof Error) {

                    try {
                        // This captures 'handles' exceptions as Sentry wouldn't actually
                        // capture these as they aren't surfaced to Electron.
                        captureException(arg);
                    } catch (e) {
                        // guard against errors within sentry itself.
                        console.error("Failed to process exception for sentry: ", e);
                    }
                }

            });

        }
    }

    public info(msg: string, ...args: any[]) {
        SentryBrowserLogger.initWhenNecessary();
    }

    public verbose(msg: string, ...args: any[]) {
        SentryBrowserLogger.initWhenNecessary();
    }

    public debug(msg: string, ...args: any[]) {
        SentryBrowserLogger.initWhenNecessary();
    }

    public async sync(): Promise<void> {
        SentryBrowserLogger.initWhenNecessary();
    }
    private static initWhenNecessary() {

        if (initialized) {
            return;
        }

        try {

            init({
                dsn: 'https://2e8b8ca6e6bf4bf58d735f2a405ecb20@sentry.io/1273707',
                // more options...
            });

            ready = true;

        } catch (e) {
            console.error("Unable to initialize sentry: ", e);
        } finally {
            initialized = true;
        }

    }

}

