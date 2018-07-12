const {Styles} = require("../../util/Styles");
const {Optional} = require("../../Optional");

const MAX_RESIZES = 25;

/**
 * Frame loader which polls the content iframe every 50ms and if the height
 * changes automatically synchronizes it with the content document.  There's
 * really no way to get loading 'progress' so the trick is to just poll fast
 * enough to get the document size so that the user never notices.
 */
class FrameResizer {

    // TODO:
    //
    // this may be a better way to do the resize animation frames.
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

        this.completed = null;

        // how long between polling should we wait to expand the size.
        this.timeoutInterval = 50;

        // the current height
        this.height = null;

        this.resizes = 0;

    }

    start() {
        this.resizeParentInBackground();
    }

    resizeParentInBackground() {
        this.doResize();

        if(this.resizes > MAX_RESIZES) {
            console.log("Hit MAX_RESIZES: " + MAX_RESIZES);
            return;
        }

        setTimeout(this.resizeParentInBackground.bind(this), this.timeoutInterval);
    }

    /**
     * Perform the resize now.
     */
    doResize() {

        let height = Styles.parsePX(Optional.of(this.iframe.style.height)
                                            .filter( current => current !== "")
                                            .getOrElse("0px"));

        let newHeight = this.iframe.contentDocument.body.scrollHeight;

        // we basically keep polling.
        if(height !== newHeight) {
            console.log(`Setting new height to: ${newHeight} vs previous ${this.iframe.style.height}`);
            this.iframe.style.height = newHeight;
            this.height = newHeight;
            ++this.resizes;
        }

    }

}

module.exports.FrameResizer = FrameResizer;
