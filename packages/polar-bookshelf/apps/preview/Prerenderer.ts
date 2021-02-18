

export namespace Prerenderer {

    export function loading() {
        (window as any).prerenderReady = false;
    }

    export function done() {
        (window as any).prerenderReady = true;
    }

    export function injectCSS() {

        // When using prerender for google we change the CSS style so that the
        // text can be visible so that we don't get dinged for trying to cheat
        // google (which isn't what we're doing) because PDFJS displays the
        // text on top of the canvas wrong.

        const mainCSS = document.styleSheets[0] as CSSStyleSheet;
        mainCSS.insertRule(".textLayer { opacity: 1.0 !important; }", 1);
        mainCSS.insertRule(".textLayer > div { color: initial !important; }", 1);
        mainCSS.insertRule(".textLayer > span { color: initial !important; }", 1);
        mainCSS.insertRule(".pdfViewer .canvasWrapper { display: none; }", 1);
    }

}
