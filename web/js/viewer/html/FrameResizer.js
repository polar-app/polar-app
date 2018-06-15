
/**
 * Frame loader which polls the content iframe until it's loaded.  There's
 * really no way to get loading 'progress' so the trick is to just poll
 * fast enough to get the document size so that the user never notices.
 */
class FrameResizer {

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
        this.timeoutInterval = 125;

    }

    start() {
        this.iframe.addEventListener("load", this.onLoad.bind(this));
        this.resizeParent();
    }

    /**
     *
     */
    onLoad() {
        console.log("Document has finished loading");
        // call once more.
        this.resizeParent();
        this.completed = true;
    }

    resizeParent() {

        if(this.completed) {
            console.log("Frame finished loading");
            return;
        }

        if(! this.iframe.contentDocument) {
            console.log("contentDocument not ready yet.");
            return;
        }

        let newHeight = this.iframe.contentDocument.documentElement.scrollHeight;
        console.log("Setting new height to: " + newHeight);
        this.parent.style.height = newHeight;

        setTimeout(this.resizeParent.bind(this), this.timeoutInterval);

    }

}

module.exports.FrameResizer = FrameResizer;
