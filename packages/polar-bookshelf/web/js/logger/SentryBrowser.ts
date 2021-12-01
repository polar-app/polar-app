import {init} from '@sentry/browser';
import {Integrations} from "@sentry/tracing";
import {CaptureConsole, Offline} from '@sentry/integrations';
import {Version} from 'polar-shared/src/util/Version';
import {DevBuild} from "../util/DevBuild";

export namespace SentryBrowser {

    import isDevBuild = DevBuild.isDevBuild;

    let initialized: boolean = false;

    export function initWhenNecessary() {

        if (initialized) {
            return;
        }

        if (isDevBuild()) {
            return;
        }

        try {

            console.log("Initializing sentry with capture console and browser tracing.");

            init({
                dsn: 'https://e44af9eaf40f42f096aaa00e59e276e2@o182611.ingest.sentry.io/5306375',
                // more options...

                integrations: [
                    // @ts-ignore
                    new CaptureConsole({
                        levels: ['error']
                    }),
                    new Integrations.BrowserTracing(),

                    // Buffer and cache events to IndexedDB or LocalStorage if offline
                    new Offline(),
                ],

                release: Version.get(),
                // Set tracesSampleRate to 1.0 to capture 100%
                // of transactions for performance monitoring.
                // We recommend adjusting this value in production
                tracesSampleRate: 1.0,

                // debug: true,
            });

        } catch (e) {
            console.error("Unable to initialize sentry: ", e);
        } finally {
            initialized = true;
        }

    }

}
