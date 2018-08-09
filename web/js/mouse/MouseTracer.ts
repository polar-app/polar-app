
/**
 * Create a visual identifier on page of the current mouse position from the
 * page events.  We also inject ourselves in child iframes.
 */
export class MouseTracer {

    private readonly doc: HTMLDocument;

    /**
     * @param doc {Document} The document to work with.
     */
    constructor(doc: HTMLDocument) {
        this.doc = doc;
    }

    start() {

        MouseTracer.startWithinDoc(this.doc);

        this.doc.querySelectorAll("iframe").forEach(iframe => {


            if(! MouseTracer.startWithinIFrame(iframe)) {

                iframe.addEventListener("load", () => {
                    MouseTracer.startWithinIFrame(iframe);
                });

            }

        })

    }

    static startWithinIFrame(iframe: HTMLIFrameElement): boolean {

        if(iframe.contentDocument) {
            MouseTracer.startWithinDoc(iframe.contentDocument);
            return true;
        }

        return false;

    }

    static startWithinDoc(doc: HTMLDocument) {

        let tracerElement = MouseTracer.createTracerElement(doc);

        doc.body.appendChild(tracerElement);

        doc.addEventListener("mousemove", mouseEvent => {

            //console.log("Got mouseEvent: ", mouseEvent);

            tracerElement.textContent = MouseTracer.format(mouseEvent);

        });

        doc.addEventListener("mouseout", mouseEvent => {

            //console.log("Got mouseEvent: ", mouseEvent);

            let last = tracerElement.textContent;

            tracerElement.textContent = `OUT (last was: ${last})`;

        });

        doc.addEventListener("click", mouseEvent => {

            console.log(`Got mouseEvent at ${doc.location.href}: `, mouseEvent);

        });

    }


    static format(mouseEvent: MouseEvent) {
        return `screen: ${mouseEvent.screenX}, ${mouseEvent.screenY} client: ${mouseEvent.clientX}, ${mouseEvent.clientY} page: ${mouseEvent.pageX}, ${mouseEvent.pageY}`;
    }

    /**
     *
     * @return {HTMLDivElement}
     */
    static createTracerElement(doc: HTMLDocument) {

        let div = doc.createElement("div");

        div.style.cssText = "position: fixed; top: 0px; right: 0px; padding: 5px; background-color: #c6c6c6; z-index: 999999; font-size: 12px; min-width: 18em; min-height: 1em;";
        div.textContent = ' ';

        return div;

    }

}
