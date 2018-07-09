// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron');

const app = electron.app;
const {Cmdline} = require("./web/js/electron/Cmdline");
const {DiskDatastore} = require("./web/js/datastore/DiskDatastore");
const {Args} = require("./web/js/electron/capture/Args");
const Browsers = require("./web/js/capture/Browsers");
const {Capture} = require("./web/js/capture/Capture");
const Logger = require("./web/js/logger/Logger").Logger;

const log = Logger.create();

let diskDatastore = new DiskDatastore();

let args = Args.parse(process.argv);

let browser = Browsers[args.browser];

if(! browser) {
    throw new Error("No browser defined for: " + args.browser);
}

// command line capture.

app.on('ready', function() {

    (async () => {

        await diskDatastore.init();

        // TODO don't use directory logging now as it is broken.
        //await Logger.init(diskDatastore.logsDir);

        let url = Cmdline.getURLArg(process.argv);

        if(! url) {
            throw new Error("URL required");
        }

        let capture = new Capture(url, browser, diskDatastore.stashDir);

        await capture.execute();

        if(args.quit) {
            log.info("Capture finished.  Quitting now");
            app.quit();
        } else {
            log.info("Not quitting (yielding to --no-quit=true).")
        }

    })().catch(err => log.error(err));

});
