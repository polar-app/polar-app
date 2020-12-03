import {init} from '@sentry/browser';
import {Integrations} from "@sentry/tracing";
import {CaptureConsole} from '@sentry/integrations';
import {Version} from 'polar-shared/src/util/Version';

export namespace SentryBrowser {

    let initialized: boolean = false;

    export function initWhenNecessary() {

        if (initialized) {
            return;
        }

        try {

            console.log("Initializing sentry with capture console and browser tracing.");

            init({
                dsn: 'https://e44af9eaf40f42f096aaa00e59e276e2@o182611.ingest.sentry.io/5306375',
                // more options...

                integrations: [
                    new CaptureConsole({
                        levels: ['error']
                    }),
                    new Integrations.BrowserTracing()
                ],

                release: Version.get(),
                // Set tracesSampleRate to 1.0 to capture 100%
                // of transactions for performance monitoring.
                // We recommend adjusting this value in production
                tracesSampleRate: 1.0,
            });

        } catch (e) {
            console.error("Unable to initialize sentry: ", e);
        } finally {
            initialized = true;
        }

    }

}