"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpectronOutputMonitorService = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const TIMEOUT = 250;
class SpectronOutputMonitorService {
    constructor(app) {
        this.stopped = false;
        this.app = Preconditions_1.Preconditions.assertPresent(app, "app");
        this.stopped = false;
    }
    start() {
        this._iter();
        console.log("SpectronOutputMonitorService started");
    }
    _iter() {
        try {
            this.doLogForwarding();
        }
        catch (e) {
            console.error(e);
        }
        this._reschedule();
    }
    doLogForwarding() {
        const client = this.app.client;
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
        setTimeout(() => this._iter(), TIMEOUT);
    }
    stop() {
        this.doLogForwarding();
        this.stopped = true;
        console.log("SpectronOutputMonitorService stopped");
    }
}
exports.SpectronOutputMonitorService = SpectronOutputMonitorService;
//# sourceMappingURL=SpectronOutputMonitorService.js.map