import {Logger} from '../logger/Logger';
import {Hashcodes} from '../Hashcodes';
import {IAnalytics} from './GA';
import {Version} from './Version';
const os = require("os");

const log = Logger.create();

const version = Version.get();

export class AppAnalytics {

    private readonly analytics: IAnalytics;

    constructor(analytics: any) {
        this.analytics = analytics;
    }

    screen(screenName: string) {

        // TODO: record OS too...

        log.info("Viewer ready... ");

        let appName = "polar-bookshelf";
        let appVer = version;
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
