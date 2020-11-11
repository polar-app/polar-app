"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prerenderer = void 0;
var Prerenderer;
(function (Prerenderer) {
    function loading() {
        window.prerenderReady = false;
    }
    Prerenderer.loading = loading;
    function done() {
        window.prerenderReady = true;
    }
    Prerenderer.done = done;
    function injectCSS() {
        const mainCSS = document.styleSheets[0];
        mainCSS.insertRule(".textLayer { opacity: 1.0 !important; }", 1);
        mainCSS.insertRule(".textLayer > div { color: initial !important; }", 1);
        mainCSS.insertRule(".textLayer > span { color: initial !important; }", 1);
        mainCSS.insertRule(".pdfViewer .canvasWrapper { display: none; }", 1);
    }
    Prerenderer.injectCSS = injectCSS;
})(Prerenderer = exports.Prerenderer || (exports.Prerenderer = {}));
//# sourceMappingURL=Prerenderer.js.map