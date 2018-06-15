const $ = require('jquery')
const {Viewer} = require("../Viewer");
const {FrameResizer} = require("./FrameResizer");
const {FrameInitializer} = require("./FrameInitializer");
const {IFrameWatcher} = require("./IFrameWatcher");
const {HTMLFormat} = require("../../docformat/HTMLFormat");

class HTMLViewer extends Viewer {

    start() {

        console.log("Starting HTMLViewer");

        this.content = document.querySelector("#content");
        this.contentParent = document.querySelector("#content-parent");
        this.textLayer = document.querySelector(".textLayer");

        this.htmlFormat = new HTMLFormat();

        // *** start the resizer and initializer before setting the iframe

        $(document).ready( function() {

            this.loadContentIFrame();

            new IFrameWatcher(this.content, function () {

                let frameResizer = new FrameResizer(this.contentParent, this.content);
                frameResizer.start();

                let frameInitializer = new FrameInitializer(this.content, this.textLayer);
                frameInitializer.start();

                this.startHandlingZoom();

            }.bind(this)).start();

        }.bind(this));

    }

    startHandlingZoom() {

        let htmlViewer = this;

        $(".polar-zoom-select")
            .change(function() {
                $( "select option:selected" ).each(function() {
                    let zoom = $( this ).val();
                    htmlViewer.changeScale(parseFloat(zoom));
                });
            })
    }

    changeScale(scale) {

        console.log("Changing scale to: " + scale);

        let iframe = document.querySelector("#content-parent iframe");
        iframe.style.transform = `scale(${scale})`;

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
