const $ = require('jquery')
const {Viewer} = require("../Viewer");
const {FrameResizer} = require("./FrameResizer");
const {FrameInitializer} = require("./FrameInitializer");
const {IFrameWatcher} = require("./IFrameWatcher");


class HTMLViewer extends Viewer {

    start() {

        console.log("Starting HTMLViewer");

        this.content = document.querySelector("#content");
        this.contentParent = document.querySelector("#content-parent");
        this.textLayer = document.querySelector(".textLayer");

        // *** start the resizer and initializer before setting the iframe

        $(document).ready( function() {

            this.loadContentIFrame();

            new IFrameWatcher(this.content, function () {

                let frameResizer = new FrameResizer(this.contentParent, this.content);
                frameResizer.start();

                let frameInitializer = new FrameInitializer(this.content, this.textLayer);
                frameInitializer.start();

            }.bind(this)).start();

        }.bind(this));

    }

    changeScale() {
        throw new Error("Not supported by this viewer.")
    }

    loadContentIFrame() {

        // *** now setup the iframe

        let url = new URL(window.location.href);

        // the pdfviewer uses the file URL convention.
        let file = url.searchParams.get("file");

        if(!file) {
            file = "example1.html";
        }

        this.content.src = file;

    }

}

module.exports.HTMLViewer = HTMLViewer;
