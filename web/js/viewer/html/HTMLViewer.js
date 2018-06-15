const {Viewer} = require("../Viewer");
const {FrameResizer} = require("./FrameResizer");
const {FrameInitializer} = require("./FrameInitializer");

class HTMLViewer extends Viewer {

    start() {

        console.log("Starting HTMLViewer");

        let content = document.querySelector("#content");
        let contentParent = document.querySelector("#content-parent");
        let textLayer = document.querySelector(".textLayer");


        let frameResizer = new FrameResizer(contentParent, content);
        frameResizer.start();

        let frameInitializer = new FrameInitializer(content, textLayer);
        frameInitializer.start();

    }

}

module.exports.HTMLViewer = HTMLViewer;
