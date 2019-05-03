
import electronPath from 'electron';
import {SpectronOutputMonitorService} from './SpectronOutputMonitorService';
import {TestResultReader} from './results/TestResultReader';
import {Logger} from '../logger/Logger';
import process from 'process';

const {Application} = require('spectron');

const log = Logger.create();

const TIMEOUT = 120000;

// String path to the Electron application executable to launch. Note: If you
// want to invoke electron directly with your app's main script then you should
// specify path as electron via electron-prebuilt and specify your app's main
// script path as the first argument in the args array.

// TODO: right now this is a really bad idea to enable.  For starters it doesn't
// actually work the way I would expect and we're going to need a better way
// to do testing of pre-installed apps.  Additionally, the log message is hidden
// so there's no way to know what is actually going on under the surface.
//
// const ELECTRON_PATH: any =
//     Optional.of(<any> process.env.POLAR_ELECTRON_PATH)
//     .getOrElse(electronPath);

const ELECTRON_PATH: any = electronPath;

/**
 * Basic spectron startup and teardown for our usage.  We also start an
 * app that monitors the main process logs and forwards them to the console.
 *
 * This also cuts down on all the boilerplate that we need from Spectron.
 */
export class Spectron {

    /**
     * The directory to run the specs from. Usually __dirname in your spec.
     */
    public static setup(dir: string, ...args: any[]) {

        log.info("Configuring spectron...");

        // TODO: since spectron requires a window to operate, we should ALWAYS
        // create a window and then return it to the user so that they can
        // work with it directly.  We should do this within setup() and require
        // a URL to load so that testing always functions properly.

        let spectronOutputMonitorService: SpectronOutputMonitorService;

        beforeEach(async function() {

            this.timeout(TIMEOUT);

            log.info("Starting spectron with dir: " + dir);

            this.app = new Application({

                // Your electron path can be any binary
                // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
                // But for the sake of the example we fetch it from our node_modules.
                path: ELECTRON_PATH,

                // Assuming you have the following directory structure

                // The following line tells spectron to look and use the main.js file
                // args: [path.join(dir, '../../..')]
                args: [dir, ...args],

                startTimeout: TIMEOUT,
                waitTimeout: TIMEOUT

            });

            log.info("Starting app...");
            const app = await this.app.start();
            log.info("Starting app...done");

            spectronOutputMonitorService = new SpectronOutputMonitorService(app);
            spectronOutputMonitorService.start();

            return app;

        });

        afterEach(async function() {

            log.info("Going to shutdown now... ");

            if (spectronOutputMonitorService) {
                spectronOutputMonitorService.stop();
                spectronOutputMonitorService._doLogForwarding();
            }

            // TODO: there's a bug here where if mocha times out it won't allow
            // us to startup then we can't actually stop and we leave behind
            // windows that are invalid.

            if (this.app && this.app.isRunning()) {
                return this.app.stop();
            } else {
                log.info("App already stopped.");
            }

        });

    }

    public static run(callback: RunCallback) {


    }

}

export interface RunCallback {

    (testResultReader: TestResultReader): void;

}


/**
 * The Spectron Application object with our custom type annotations.  We had
 * to add this as around for Typescript causing Spectron and jquery to collide.
 */
export interface TApplication {

    client: TBrowser;

    stop(): void;

}

export interface TBrowser {

    getWindowCount(): Promise<number>;

    windowHandle(): string;

    windowHandles(): WindowHandle[];

    window(windowHandle: WindowHandle): void;

    getTitle(): string;

    executeAsync<T>(callback: ExecuteAsyncFunction<T>): Promise<T>;

}

export interface ExecuteAsyncFunction<T> {
    (done: (val: T) => void): void;
}

type WindowHandle = string;

