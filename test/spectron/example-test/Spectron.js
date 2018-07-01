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

    static setup() {

        let spectronOutputMonitorService;

        beforeEach(async function () {

            this.app = new Application({

                // Your electron path can be any binary
                // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
                // But for the sake of the example we fetch it from our node_modules.
                path: electronPath,

                // Assuming you have the following directory structure

                // The following line tells spectron to look and use the main.js file
                //args: [path.join(__dirname, '../../..')]
                args: [__dirname]

            });

            let app = await this.app.start();

            spectronOutputMonitorService = new SpectronOutputMonitorService(app);
            spectronOutputMonitorService.start();

            return app;

        });

        afterEach(function () {

            spectronOutputMonitorService.stop();

            if (this.app && this.app.isRunning()) {
                return this.app.stop()
            }

        });

    }

}

module.exports.Spectron = Spectron;
