
class MouseTracer {

    /**
     * @param doc {Document} The document to work with.
     */
    constructor(doc) {
        this.doc = doc;
    }

    start() {

        let tracerElement = this.createTracerElement();

        this.doc.body.appendChild(tracerElement);

        this.doc.addEventListener("mousemove", mouseEvent => {

            //console.log("Got mouseEvent: ", mouseEvent);

            tracerElement.textContent = this.toString(mouseEvent);

        });

        this.doc.addEventListener("mouseout", mouseEvent => {

            //console.log("Got mouseEvent: ", mouseEvent);

            tracerElement.textContent = "";

        });

    }

    toString(mouseEvent) {
        return `screen: ${mouseEvent.screenX}, ${mouseEvent.screenY} client: ${mouseEvent.clientX}, ${mouseEvent.clientY} page: ${mouseEvent.pageX}, ${mouseEvent.pageY}`;
    }

    /**
     *
     * @return {HTMLDivElement}
     */
    createTracerElement() {

        let div = this.doc.createElement("div");

        div.style = "position: fixed; top: 0px; right: 0px; padding: 5px; background-color: #c6c6c6; z-index: 1; font-size: 12px; min-width: 18em; min-height: 1em;";

        div.textContent = ' ';

        return div;

    }

}

module.exports.MouseTracer = MouseTracer;
