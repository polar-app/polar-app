import {ILogger} from 'polar-shared/src/logger/ILogger';
import {isPresent} from 'polar-shared/src/Preconditions';
import process from "process";
// import { init, captureException } from '@sentry/electron';

// This configures the Electron CrashReporter for native app crashes and
// captures any uncaught JavaScript exceptions using the JavaScript SDKs under
// the hood. Be sure to call this function as early as possible in the main
// process and all renderer processes to also catch errors during startup.

let initialized: boolean = false;

// true when sentry is ready for logging.
let ready: boolean = false;

export class SentryNodeLogger implements ILogger {

    public readonly name: string = 'sentry-node-logger';

    public notice(msg: string, ...args: any[]) {
        SentryNodeLogger.initWhenNecessary();
    }

    public warn(msg: string, ...args: any[]) {
        SentryNodeLogger.initWhenNecessary();
    }

    public error(msg: string, ...args: any[]) {

        SentryNodeLogger.initWhenNecessary();

        if (ready) {

            args.forEach(arg => {

                if ( arg instanceof Error) {

                    try {
                        // This captures 'handles' exceptions as Sentry wouldn't actually
                        // capture these as they aren't surfaced to Electron.
                        // captureException(arg);
                    } catch (e) {
                        // guard against errors within sentry itself.
                        console.error("Failed to process exception for sentry: ", e);
                    }
                }

            });

        }
    }

    public info(msg: string, ...args: any[]) {
        SentryNodeLogger.initWhenNecessary();
    }

    public verbose(msg: string, ...args: any[]) {
        SentryNodeLogger.initWhenNecessary();
    }

    public debug(msg: string, ...args: any[]) {
        SentryNodeLogger.initWhenNecessary();
    }

    public async sync(): Promise<void> {
        SentryNodeLogger.initWhenNecessary();
    }

    public static isEnabled() {

        if (isPresent(process.env.POLAR_SENTRY_ENABLED)) {
            return process.env.POLAR_SENTRY_ENABLED === 'true';
        }

        return ! isPresent(process.env.SNAP);
    }

    private static initWhenNecessary() {

        if (initialized) {
            return;
        }

        try {

            if (SentryNodeLogger.isEnabled()) {
                // init({
                //     dsn: 'https://2e8b8ca6e6bf4bf58d735f2a405ecb20@sentry.io/1273707',
                //     // more options...
                // });
            }

            ready = true;

        } catch (e) {
            console.error("Unable to initialize sentry: ", e);
        } finally {
            initialized = true;
        }

    }

}

