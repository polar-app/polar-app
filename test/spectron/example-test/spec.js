const {Application} = require('spectron');
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');
const {Preconditions} = require("../../../web/js/Preconditions");

/**
 * Keep a background monitor to read logs and then write them to the main process.
 */
class SpectronOutputMonitorService {

    constructor(app) {
        this.app = Preconditions.assertNotNull(app, "app");
        this.stopped = false;
    }

    start() {
        this._iter();
    }

    _iter() {

        this._doLogForwarding();
        this._reschedule();

    }

    _doLogForwarding() {

        let client = this.app.client;

        if(client) {

            // right now e only forward the main because we can get the renderer
            // via the javascript console.
            client.getMainProcessLogs().then(function (logs) {
                logs.forEach(function (log) {
                    console.log("main: " + log);
                })

            })

        }

    }

    _reschedule() {

        if(this.stopped) {
            return;
        }

        setTimeout(() => {
            this._doLogForwarding();
        }, 100);

    }

    stop() {

        // do one more just to make sure we don't have any missing last moment
        // logs
        this._doLogForwarding();
        this.stopped = true;

        console.log("SpectronOutputMonitorService stopped");

    }

}

function setup() {

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

describe('Application launch', function () {

    this.timeout(10000)

    setup();

    it('shows an initial window', function () {

        return this.app.client.getWindowCount().then(function (count) {
            assert.equal(count, 1)
            // Please note that getWindowCount() will return 2 if `dev tools` are opened.
            // assert.equal(count, 2)
        })

    });

});
