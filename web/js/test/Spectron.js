const {SpectronOutputMonitorService} = require("./SpectronOutputMonitorService");
const {Application} = require('spectron');
const electronPath = require('electron');

/**
 * Basic spectron startup and teardown for our usage.  We also start an
 * app that monitors the main process logs and forwards them to the console.
 *
 * This also cuts down on all the boilerplate that we need from Spectron.
 */
class Spectron {

    /**
     * The directory to run the specs from. Usually __dirname in your spec.
     * @param dir
     */
    static setup(dir) {

        // TODO: since spectron requires a window to operate, we should ALWAYS
        // create a window and then return it to the user so that they can
        // work with it directly.

        let spectronOutputMonitorService;

        beforeEach(async function () {

            console.log("Starting spectron with dir: " + dir);

            this.app = new Application({

                // Your electron path can be any binary
                // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
                // But for the sake of the example we fetch it from our node_modules.
                path: electronPath,

                // Assuming you have the following directory structure

                // The following line tells spectron to look and use the main.js file
                //args: [path.join(__dirname, '../../..')]
                args: [dir]

            });

            console.log("Starting app...");
            let app = await this.app.start();
            console.log("Starting app...done");

            spectronOutputMonitorService = new SpectronOutputMonitorService(app);
            spectronOutputMonitorService.start();

            return app;

        });

        afterEach(function () {

            if(spectronOutputMonitorService) {
                spectronOutputMonitorService.stop();
            }

            if (this.app && this.app.isRunning()) {
                return this.app.stop()
            }

        });

    }

}

module.exports.Spectron = Spectron;
