import {ILogger} from 'polar-shared/src/logger/ILogger';
import {captureException, init} from '@sentry/browser';
import {SentryBrowser} from "./SentryBrowser";

SentryBrowser.initWhenNecessary();

export class SentryBrowserLogger implements ILogger {

    public readonly name: string = 'sentry-browser-logger';

    public notice(msg: string, ...args: any[]) {
        SentryBrowser.initWhenNecessary();
    }

    public warn(msg: string, ...args: any[]) {
        SentryBrowser.initWhenNecessary();
    }

    public error(msg: string, ...args: any[]) {

        SentryBrowser.initWhenNecessary();

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

    public info(msg: string, ...args: any[]) {
        SentryBrowser.initWhenNecessary();
    }

    public verbose(msg: string, ...args: any[]) {
        SentryBrowser.initWhenNecessary();
    }

    public debug(msg: string, ...args: any[]) {
        SentryBrowser.initWhenNecessary();
    }

    public async sync(): Promise<void> {
        SentryBrowser.initWhenNecessary();
    }
    
}

