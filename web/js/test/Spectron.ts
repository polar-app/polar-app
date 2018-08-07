import {SpectronOutputMonitorService} from './SpectronOutputMonitorService';
import {TestResultReader} from './results/TestResultReader';
const {Application} = require('spectron');
const electronPath = require('electron');

const TIMEOUT = 10000;

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
    static setup(dir: string, ...args: any[]) {

        console.log("Configuring spectron...");

        // TODO: since spectron requires a window to operate, we should ALWAYS
        // create a window and then return it to the user so that they can
        // work with it directly.  We should do this within setup() and require
        // a URL to load so that testing always functions properly.

        let spectronOutputMonitorService : SpectronOutputMonitorService;

        beforeEach(async function () {

            console.log("Starting spectron with dir: " + dir);

            this.app = new Application({

                // Your electron path can be any binary
                // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
                // But for the sake of the example we fetch it from our node_modules.
                path: electronPath,

                // Assuming you have the following directory structure

                // The following line tells spectron to look and use the main.js file
                //args: [path.join(dir, '../../..')]
                args: [dir, ...args],

                startTimeout: TIMEOUT,
                waitTimeout: TIMEOUT

            });

            console.log("Starting app...");
            let app = await this.app.start();
            console.log("Starting app...done");

            spectronOutputMonitorService = new SpectronOutputMonitorService(app);
            spectronOutputMonitorService.start();

            return app;

        });

        afterEach(function () {
            //
            console.log("Going to shutdown now... ");

            if(spectronOutputMonitorService) {
                spectronOutputMonitorService.stop();
                spectronOutputMonitorService._doLogForwarding();
            }

            if (this.app && this.app.isRunning()) {
                console.log("Telling app to stop");
                return this.app.stop()
            } else {
                console.log("App already stopped.");
            }

        });

    }

    static run(callback: RunCallback) {


    }

}

export interface RunCallback {

    (testResultReader: TestResultReader): void;

}
