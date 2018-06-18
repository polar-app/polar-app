const $ = require('jquery')

/**
 * Frame loader which polls the content iframe until it's loaded.  There's
 * really no way to get loading 'progress' so the trick is to just poll
 * fast enough to get the document size so that the user never notices.
 */
class FrameResizer {

    // TODO:
    //
    // this may be a better way to do the resizing:
    //
    // https://stackoverflow.com/questions/1835219/is-there-an-event-that-fires-on-changes-to-scrollheight-or-scrollwidth-in-jquery

    constructor(parent, iframe) {

        if(!parent) {
            throw new Error("No parent");
        }

        if(!iframe) {
            throw new Error("No iframe");
        }

        this.parent = parent;
        this.iframe = iframe;

        this.completed = false;

        // how long between polling should we wait to expand the size.
        this.timeoutInterval = 100;

    }

    start() {

        this.iframe.contentDocument.addEventListener("readystatechange", this.onReadyStateChange.bind(this));
        this.resizeParentInBackground();

    }

    onReadyStateChange() {

        if(this.iframe.contentDocument.readyState === "complete") {
            // console.log("FrameResizer: Document has finished loading: " + this.iframe.contentDocument.location.href);
            // this.completed = true;
        } else {
            console.log("FrameResizer: Document has started loading: " +  this.iframe.contentDocument.location.href);
            this.completed = false;
        }

    }

    resizeParentInBackground() {

        // do not yield after loading now. CSS can still change on us. Figure
        // out a cleaner way to listen for size changes.
        // if(this.completed) {
        //     return;
        // }

        this.doResize();

        setTimeout(this.resizeParentInBackground.bind(this), this.timeoutInterval);

    }

    /**
     * Perform the resize now.
     */
    doResize() {

        let newHeight = this.iframe.contentDocument.body.scrollHeight;
        console.log("Setting new height to: " + newHeight);
        this.iframe.style.height = newHeight;

    }

}

module.exports.FrameResizer = FrameResizer;
