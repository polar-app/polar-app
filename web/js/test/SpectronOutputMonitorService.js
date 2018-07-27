"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Preconditions } = require("../Preconditions");
const TIMEOUT = 250;
class SpectronOutputMonitorService {
    constructor(app) {
        this.stopped = false;
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
        if (client) {
            client.getMainProcessLogs().then(function (logs) {
                logs.forEach(function (log) {
                    console.log("main: " + log);
                });
            });
            client.getRenderProcessLogs().then(function (logs) {
                logs.forEach(function (log) {
                    console.log(`render: ${log.timestamp} ${log.source} ${log.level}: ${log.message}`);
                });
            });
        }
        else {
        }
    }
    _reschedule() {
        if (this.stopped) {
            return;
        }
        setTimeout(() => {
            this._doLogForwarding();
        }, TIMEOUT);
    }
    stop() {
        this._doLogForwarding();
        this.stopped = true;
        console.log("SpectronOutputMonitorService stopped");
    }
}
exports.SpectronOutputMonitorService = SpectronOutputMonitorService;
module.exports.SpectronOutputMonitorService = SpectronOutputMonitorService;
//# sourceMappingURL=SpectronOutputMonitorService.js.map