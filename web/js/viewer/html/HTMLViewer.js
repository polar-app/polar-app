"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JQuery_1 = __importDefault(require("../../ui/JQuery"));
const Viewer_1 = require("../Viewer");
const Logger_1 = require("../../logger/Logger");
const Preconditions_1 = require("../../Preconditions");
const { FrameResizer } = require("./FrameResizer");
const { FrameInitializer } = require("./FrameInitializer");
const { IFrameWatcher } = require("./IFrameWatcher");
const { HTMLFormat } = require("../../docformat/HTMLFormat");
const log = Logger_1.Logger.create();
class HTMLViewer extends Viewer_1.Viewer {
    constructor(model) {
        super();
        this.content = document.createElement('iframe');
        this.contentParent = document.createElement('div');
        this.textLayer = document.createElement('div');
        this.requestParams = null;
        this.model = model;
    }
    start() {
        super.start();
        console.log("Starting HTMLViewer");
        this.content = document.querySelector("#content");
        this.contentParent = document.querySelector("#content-parent");
        this.textLayer = document.querySelector(".textLayer");
        this.htmlFormat = new HTMLFormat();
        JQuery_1.default(document).ready(() => {
            console.log("FIXME999");
            this.requestParams = this._requestParams();
            this._captureBrowserZoom();
            this._loadRequestData();
            this._configurePageWidth();
            new IFrameWatcher(this.content, () => {
                console.log("Loading page now...");
                let frameResizer = new FrameResizer(this.contentParent, this.content);
                frameResizer.start();
                let frameInitializer = new FrameInitializer(this.content, this.textLayer);
                frameInitializer.start();
                this.startHandlingZoom();
            }).start();
        });
    }
    _captureBrowserZoom() {
        JQuery_1.default(document).keydown(function (event) {
            if (event.ctrlKey && (event.which === 61 ||
                event.which === 107 ||
                event.which === 173 ||
                event.which === 109 ||
                event.which === 187 ||
                event.which === 189)) {
                console.log("Browser zoom detected. Preventing.");
                event.preventDefault();
            }
        });
        JQuery_1.default(window).bind('mousewheel DOMMouseScroll', function (event) {
            if (event.ctrlKey) {
                console.log("Browser zoom detected. Preventing.");
                event.preventDefault();
            }
        });
    }
    startHandlingZoom() {
        let htmlViewer = this;
        JQuery_1.default(".polar-zoom-select")
            .change(function () {
            JQuery_1.default("select option:selected").each(function () {
                let zoom = JQuery_1.default(this).val();
                htmlViewer.changeScale(parseFloat(zoom));
            });
            console.log("Blurring the select to allow keyboard/mouse nav.");
            JQuery_1.default(this).blur();
        });
    }
    _configurePageWidth() {
        let width = 750;
        let descriptor = Preconditions_1.notNull(this.requestParams).descriptor;
        if (descriptor && descriptor.browser) {
            width = descriptor.browser.deviceEmulation.screenSize.width;
            log.info("Setting width from device emulation: " + width);
        }
        if ("scroll" in descriptor &&
            typeof descriptor.scroll.width === "number" &&
            descriptor.scroll.width > width) {
            width = descriptor.scroll.width;
            log.info("Setting width from scroll settings: " + width);
        }
        let minHeight = (11 / 8.5) * width;
        console.log(`Configuring page with width=${width} and minHeight=${minHeight}`);
        document.querySelectorAll("#content-parent, .page, iframe").forEach(element => {
            element.style.width = `${width}px`;
        });
        document.querySelectorAll(".page, iframe").forEach((element) => {
            element.style.minHeight = `${minHeight}px`;
        });
    }
    changeScale(scale) {
        console.log("Changing scale to: " + scale);
        this._changeScaleMeta(scale);
        this._changeScale(scale);
        this._removeAnnotations();
        this._signalScale();
    }
    _changeScaleMeta(scale) {
        let metaElement = Preconditions_1.notNull(document.querySelector("meta[name='polar-scale']"));
        metaElement.setAttribute("content", `${scale}`);
    }
    _changeScale(scale) {
        let iframe = Preconditions_1.notNull(document.querySelector("iframe"));
        let iframeParentElement = iframe.parentElement;
        let contentParent = Preconditions_1.notNull(document.querySelector("#content-parent"));
        contentParent.style.transform = `scale(${scale})`;
    }
    _removeAnnotations() {
        document.querySelectorAll(".page .annotation").forEach(function (annotation) {
            annotation.parentElement.removeChild(annotation);
        });
    }
    _signalScale() {
        console.log("HTMLViewer: Signaling rescale.");
        let pageElement = Preconditions_1.notNull(document.querySelector(".page"));
        let endOfContent = Preconditions_1.notNull(pageElement.querySelector(".endOfContent"));
        Preconditions_1.notNull(Preconditions_1.notNull(endOfContent).parentElement).removeChild(endOfContent);
        endOfContent = document.createElement("div");
        endOfContent.setAttribute("class", "endOfContent");
        pageElement.appendChild(endOfContent);
    }
    _requestParams() {
        let url = new URL(window.location.href);
        return {
            file: Preconditions_1.notNull(url.searchParams.get("file")),
            descriptor: JSON.parse(Preconditions_1.notNull(url.searchParams.get("descriptor"))),
            fingerprint: Preconditions_1.notNull(url.searchParams.get("fingerprint"))
        };
    }
    _loadRequestData() {
        let params = this._requestParams();
        let file = params.file;
        if (!file) {
            file = "example1.html";
        }
        this.content.src = file;
        let fingerprint = params.fingerprint;
        if (!fingerprint) {
            throw new Error("Fingerprint is required");
        }
        this.htmlFormat.setCurrentDocFingerprint(fingerprint);
    }
    docDetails() {
        let requestParams = Preconditions_1.notNull(this.requestParams);
        return {
            url: requestParams.descriptor.url,
            title: requestParams.descriptor.title
        };
    }
}
exports.HTMLViewer = HTMLViewer;
//# sourceMappingURL=HTMLViewer.js.map