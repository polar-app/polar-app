const {GA} = require("../ga/GA");
const log = require("../logger/Logger").create();
const {Hashcodes} = require("../Hashcodes");
const os = require("os");

class Viewer {

    start() {

        $(document).ready(() => {

            log.info("Viewer ready... ");

            let appName = "polar-bookshelf";
            let appVer = "1.0.0-betaX";
            let appID = "io.inputneuron.polar";

            let appInstallerID = "unknown";
            let screenName = "unknown";

            if(document.location.href.indexOf("/pdfviewer/") !== -1) {
                screenName = "pdfviewer";
            }

            if(document.location.href.indexOf("/htmlviewer/") !== -1) {
                screenName = "htmlviewer";
            }

            // get a hash of the hostname.  We don't care about the actual
            // hostname value and don't want to compromise someone's privacy but
            // we want some sort of tracking cookie to understand user behavior.
            let clientID = Hashcodes.createID(os.hostname());

            GA.getInstance().screen(appName, appVer, appID, appInstallerID, screenName, clientID)
              .catch( err => log.error("Could not send tracking information: ", err));

            log.info(`Sent GA tracking info for screen ${screenName}`);

        });

    }

    changeScale(scale) {
        throw new Error("Not supported by this viewer.")
    }

}

module.exports.Viewer = Viewer;
