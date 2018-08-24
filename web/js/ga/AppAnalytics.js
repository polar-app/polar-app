"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../logger/Logger");
const Hashcodes_1 = require("../Hashcodes");
const Version_1 = require("./Version");
const os = require("os");
const log = Logger_1.Logger.create();
const version = Version_1.Version.get();
class AppAnalytics {
    constructor(analytics) {
        this.analytics = analytics;
    }
    screen(screenName) {
        log.info("Viewer ready... ");
        let appName = "polar-bookshelf";
        let appVer = version;
        let appID = "io.inputneuron.polar";
        let appInstallerID = "unknown";
        let clientID = Hashcodes_1.Hashcodes.createID(os.hostname());
        this.analytics.screen(appName, appVer, appID, appInstallerID, screenName, clientID)
            .catch(err => log.error("Could not send tracking information: ", err));
        log.info(`Sent GA tracking info for screen ${screenName}`);
    }
}
exports.AppAnalytics = AppAnalytics;
//# sourceMappingURL=AppAnalytics.js.map