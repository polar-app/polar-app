const $ = require('jquery')

const {Preconditions} = require("../../Preconditions");
const {Objects} = require("../../util/Objects");

/**
 * Assumes that you have tried to change the URL for an iframe and watches for
 * it to start loading properly.
 */
class IFrameWatcher {

    // TODO: right now we look for the URL not being about:blank which is kind
    // of a hack but works for now.  Technically we should listen to the
    // iframe src attribute changing.

    constructor(iframe, callback, options ) {
        this.iframe = Preconditions.assertNotNull(iframe, "iframe");
        this.options = Objects.defaults(options, {
            timeoutInterval: 100,
            currentURL: "about:blank"
        });
        this.callback = Preconditions.assertNotNull(callback, "callback");

        this.completed = false;

    }

    start() {
        this.watchInBackground();
    }

    watchInBackground() {

        if(this.iframe.contentDocument &&
           this.iframe.contentDocument.location.href !== this.options.currentURL) {

            console.log("Detected iframe URL loading (calling callback now): ", this.iframe.contentDocument.location.href);
            this.callback();
            return;

        }

        setTimeout(this.watchInBackground.bind(this), this.options.timeoutInterval);

    }

}

module.exports.IFrameWatcher = IFrameWatcher;
