import {ILogger} from 'polar-shared/src/logger/ILogger';

import {captureException, init} from '@sentry/browser';

let initialized: boolean = false;

function initWhenNecessary() {

    if (initialized) {
        return;
    }

    try {

        init({
            dsn: 'https://e44af9eaf40f42f096aaa00e59e276e2@o182611.ingest.sentry.io/5306375',
            // more options...
        });

    } catch (e) {
        console.error("Unable to initialize sentry: ", e);
    } finally {
        initialized = true;
    }

}

export class SentryBrowserLogger implements ILogger {

    public readonly name: string = 'sentry-browser-logger';

    public notice(msg: string, ...args: any[]) {
        initWhenNecessary();
    }

    public warn(msg: string, ...args: any[]) {
        initWhenNecessary();
    }

    public error(msg: string, ...args: any[]) {

        initWhenNecessary();

        if (initialized) {

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
        initWhenNecessary();
    }

    public verbose(msg: string, ...args: any[]) {
        initWhenNecessary();
    }

    public debug(msg: string, ...args: any[]) {
        initWhenNecessary();
    }

    public async sync(): Promise<void> {
        initWhenNecessary();
    }
    
}

