/**
 * Enable or disable modern text layers.
 */
export class PDFModernTextLayers {

    public static configure() {

        const enabled = true;

        if (enabled) {
            this.enable();
        } else {
            this.disable();
        }

    }

    private static notice(enabled: boolean) {
        // log.notice("PDF layer using modern text layers: " + enabled);
    }

    public static enable() {

        this.notice(true);

        if (window.localStorage) {

            const val = {
                "showPreviousViewOnLoad": true,
                "defaultZoomValue": "",
                "sidebarViewOnLoad": 0,
                "cursorToolOnLoad": 0,
                "enableWebGL": false,
                "eventBusDispatchToDOM": false,
                "pdfBugEnabled": false,
                "disableRange": false,
                "disableStream": false,
                "disableAutoFetch": false,
                "disableFontFace": false,
                "textLayerMode": 2,
                "useOnlyCssZoom": false,
                "externalLinkTarget": 0,
                "renderer": "canvas",
                "renderInteractiveForms": false,
                "enablePrintAutoRotate": false,
                "disablePageMode": false,
                "disablePageLabels": false,
                "scrollModeOnLoad": 0,
                "spreadModeOnLoad": 0
            };

            const json = JSON.stringify(val);

            window.localStorage.setItem('pdfjs.preferences', json);

        }

    }

    public static disable() {
        this.notice(true);
        window.localStorage.removeItem('pdfjs.preferences');
    }

}
