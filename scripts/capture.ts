import {Logger} from '../web/js/logger/Logger';
import {BrowserProfiles} from '../web/js/capture/BrowserProfiles';
import {DiskDatastore} from '../web/js/datastore/DiskDatastore';
import {Args} from '../web/js/electron/capture/Args';
import {Capture} from '../web/js/capture/Capture';
import BrowserRegistry from '../web/js/capture/BrowserRegistry';

const electron = require('electron');
const app = electron.app;

const {Cmdline} = require("../web/js/electron/Cmdline");

const log = Logger.create();

let diskDatastore = new DiskDatastore();

let args = Args.parse(process.argv);

let browser = BrowserRegistry[args.browser];

if(! browser) {
    throw new Error("No browser defined for: " + args.browser);
}

log.info("Using browser profile: " + args.profile);
let browserProfile = BrowserProfiles.toBrowserProfile(browser, args.profile);

app.on('ready', function() {

    (async () => {

        await diskDatastore.init();

        // TODO don't use directory logging now as it is broken.
        //await Logger.init(diskDatastore.logsDir);

        let url = Cmdline.getURLArg(process.argv);

        if(! url) {

            if(! url) {
                console.warn("URL is required.");
                app.quit();
                return;
            }

            url = "https://www.example.com"

        }

        console.log("Going to capture URL: " + url);

        // TODO: sync up args + CaptureOpts
        let captureOpts = {
            amp: args.amp
        };

        let capture = new Capture(url, browserProfile, diskDatastore.stashDir, captureOpts);

        await capture.start();

        if(args.quit) {
            log.info("Capture finished.  Quitting now");
            app.quit();
        } else {
            log.info("Not quitting (yielding to --no-quit=true).")
        }

    })().catch(err => console.error(err));

});
