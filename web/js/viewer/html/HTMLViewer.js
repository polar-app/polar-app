const $ = require('jquery');
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

            this._captureBrowserZoom();

            this._loadRequestData();

            new IFrameWatcher(this.content, function () {

                let frameResizer = new FrameResizer(this.contentParent, this.content);
                frameResizer.start();

                let frameInitializer = new FrameInitializer(this.content, this.textLayer);
                frameInitializer.start();

                this.startHandlingZoom();

            }.bind(this)).start();

        }.bind(this));

    }

    _captureBrowserZoom() {

        $(document).keydown(function(event) {
            if (event.ctrlKey===true && (event.which === '61' ||
                                         event.which === '107' ||
                                         event.which === '173' ||
                                         event.which === '109'  ||
                                         event.which === '187'  ||
                                         event.which === '189'  ) ) {

                console.log("Browser zoom detected. Preventing.");
                event.preventDefault();

            }
            // 107 Num Key  +
            // 109 Num Key  -
            // 173 Min Key  hyphen/underscor Hey
            // 61 Plus key  +/= key
        });

        $(window).bind('mousewheel DOMMouseScroll', function (event) {
            if (event.ctrlKey === true) {

                console.log("Browser zoom detected. Preventing.");
                event.preventDefault();

            }
        });
    }

    startHandlingZoom() {

        let htmlViewer = this;

        $(".polar-zoom-select")
            .change(function() {
                $( "select option:selected" ).each(function() {
                    let zoom = $( this ).val();
                    htmlViewer.changeScale(parseFloat(zoom));
                });

                // make sure the select doesn't have focus so that we can scroll.
                console.log("Blurring the select to allow keyboard/mouse nav.");
                $(this).blur();

            })
    }

    changeScale(scale) {

        console.log("Changing scale to: " + scale);

        this._changeIFrameScale(scale);
        this._signalPageScale();

    }

    _changeIFrameScale(scale) {
        let iframe = document.querySelector("#content-parent iframe");
        iframe.style.transform = `scale(${scale})`;

    }

    // remove and re-inject an endOfContent element to trigger the view to
    // re-draw pagemarks.
    _signalPageScale() {

        let pageElement = document.querySelector(".page");
        let endOfContent = pageElement.querySelector(".endOfContent");
        endOfContent.parentElement.removeChild(endOfContent);

        endOfContent = document.createElement("div");
        endOfContent.setAttribute("class", "endOfContent" );

        pageElement.appendChild(endOfContent);
    }

    _loadRequestData() {

        // *** now setup the iframe

        let url = new URL(window.location.href);

        // the pdfviewer uses the file URL convention.
        let file = url.searchParams.get("file");

        if(!file) {
            file = "example1.html";
        }

        this.content.src = file;

        let fingerprint = url.searchParams.get("fingerprint");
        if(!fingerprint) {
            throw new Error("Fingerprint is required");
        }

        this.htmlFormat.setCurrentDocFingerprint(fingerprint);

    }

}

module.exports.HTMLViewer = HTMLViewer;
