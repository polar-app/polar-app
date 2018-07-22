
const log = require("../logger/Logger").create();
const {Hashcodes} = require("../Hashcodes");
const os = require("os");

class AppAnalytics {

    constructor(analytics) {
        this.analytics = analytics;
    }

    screen(screenName) {

        log.info("Viewer ready... ");

        let appName = "polar-bookshelf";
        let appVer = "1.0.0-betaX";
        let appID = "io.inputneuron.polar";

        let appInstallerID = "unknown";

        // get a hash of the hostname.  We don't care about the actual
        // hostname value and don't want to compromise someone's privacy but
        // we want some sort of tracking cookie to understand user behavior.
        let clientID = Hashcodes.createID(os.hostname());

        this.analytics.screen(appName, appVer, appID, appInstallerID, screenName, clientID)
          .catch( err => log.error("Could not send tracking information: ", err));

        log.info(`Sent GA tracking info for screen ${screenName}`);

    }

}

module.exports.AppAnalytics = AppAnalytics;
