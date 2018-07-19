
/**
 * Create a visual identifier on page of the current mouse position from the
 * page events.  We also inject ourselves in child iframes.
 */
class MouseTracer {

    /**
     * @param doc {Document} The document to work with.
     */
    constructor(doc) {
        this.doc = doc;
    }

    start() {

        MouseTracer.startWithinDoc(this.doc);

        this.doc.querySelectorAll("iframe").forEach(iframe => {

            if(iframe.contentDocument) {
                MouseTracer.startWithinDoc(iframe.contentDocument);
            }

            iframe.addEventListener("load", () => MouseTracer.startWithinDoc(iframe.contentDocument));

        })

    }



    static startWithinDoc(doc) {

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


    static format(mouseEvent) {
        return `screen: ${mouseEvent.screenX}, ${mouseEvent.screenY} client: ${mouseEvent.clientX}, ${mouseEvent.clientY} page: ${mouseEvent.pageX}, ${mouseEvent.pageY}`;
    }

    /**
     *
     * @return {HTMLDivElement}
     */
    static createTracerElement(doc) {

        let div = doc.createElement("div");

        div.style = "position: fixed; top: 0px; right: 0px; padding: 5px; background-color: #c6c6c6; z-index: 999999; font-size: 12px; min-width: 18em; min-height: 1em;";

        div.textContent = ' ';

        return div;

    }

}

module.exports.MouseTracer = MouseTracer;
