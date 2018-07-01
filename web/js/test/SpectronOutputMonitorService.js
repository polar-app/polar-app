const {Preconditions} = require("../Preconditions");

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
        console.log("SpectronOutputMonitorService started");

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

            // right now e only forward the main because we can get the renderer
            // via the javascript console.
            client.getRenderProcessLogs().then(function (logs) {
                logs.forEach(function (log) {
                    console.log("render: " + log);
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

module.exports.SpectronOutputMonitorService = SpectronOutputMonitorService;
