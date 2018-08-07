// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron');
const app = electron.app;
const BrowserRegistry = require("../web/js/capture/BrowserRegistry");
const prompt = require('electron-prompt');

const {Cmdline} = require("../web/js/electron/Cmdline");
const {DiskDatastore} = require("../web/js/datastore/DiskDatastore");
const {Args} = require("../web/js/electron/capture/Args");
const {Capture} = require("../web/js/capture/Capture");
const {CaptureOpts} = require("../web/js/capture/CaptureOpts");
const {Logger} = require("../web/js/logger/Logger");
const {Browsers} = require("../web/js/capture/Browsers");
const log = Logger.create();

let diskDatastore = new DiskDatastore();

let args = Args.parse(process.argv);

let browser = BrowserRegistry[args.browser];

if(! browser) {
    throw new Error("No browser defined for: " + args.browser);
}

if(args.profile) {
    log.info("Using browser profile: " + args.profile);
    browser = Browsers.toProfile(browser, args.profile);
}

app.on('ready', function() {

    (async () => {

        await diskDatastore.init();

        // TODO don't use directory logging now as it is broken.
        //await Logger.init(diskDatastore.logsDir);

        let url = Cmdline.getURLArg(process.argv);

        if(! url) {

            url = await prompt({
                title: 'Enter a URL to Capture',
                label: 'URL: ',
                value: '',
                inputAttrs: {
                    type: 'url'
                },
            });

            if(! url) {
                console.warn("URL is required.");
                app.quit();
                return;
            }

            url = "https://www.example.com"

        }

        console.log("Going to capture URL: " + url);

        // TODO: sync up args + CaptureOpts
        let captureOpts = new CaptureOpts({
            amp: args.amp
        });

        let capture = new Capture(url, browser, diskDatastore.stashDir, captureOpts);

        await capture.execute();

        if(args.quit) {
            log.info("Capture finished.  Quitting now");
            app.quit();
        } else {
            log.info("Not quitting (yielding to --no-quit=true).")
        }

    })().catch(err => console.error(err));

});
