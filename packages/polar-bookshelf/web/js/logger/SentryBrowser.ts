import {init} from '@sentry/browser';
import {Integrations} from "@sentry/tracing";
import {CaptureConsole} from '@sentry/integrations';
import {Version} from 'polar-shared/src/util/Version';
import {AppRuntime} from "polar-shared/src/util/AppRuntime";

export namespace SentryBrowser {

    let initialized: boolean = false;

    function isLocal() {

        if (AppRuntime.isNode()) {
            return false;
        }

        if (typeof document === 'undefined') {
            return false;
        }

        return ['localhost', '127.0.0.1'].includes(document.location.hostname);

    }

    export function initWhenNecessary() {

        if (initialized) {
            return;
        }

        if (isLocal()) {
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