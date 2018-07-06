const interact = require("interactjs");
const $ = require("jquery");

// this is used later in the resizing and gesture demos
//window.dragMoveListener = dragMoveListener;

function computeRestriction(x,y, interactionEvent) {

    let element = interactionEvent.element;

    if(! element) {
        throw new Error("No element");
    }

    let parentElement = element.parentElement;

    if(! parentElement) {
        throw new Error("No parentElement");
    }

    let rect = parentElement.getBoundingClientRect();

    // FIXME: this actually DOES work to implement the restriction properly...
    // rect.height = rect.height - 100;
    // rect.bottom = rect.bottom - 100;

    return rect;

}

function init(selector) {

    // FIXME.. it actually takes 'el' as teh first param.
    interact(selector)
        .draggable({
            restrict: {
                restriction: 'parent',
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
        })
        .resizable({

            // resize from all edges and corners
            edges: {
                left: true,
                right: true,
                bottom: true,
                top: true
            },

            // Keep the edges inside the parent. this is needed or else the
            // bound stretches slightly beyond the container.
            restrictEdges: {
                //outer: 'parent',
                outer: computeRestriction,
            },

            restrict: {
                //restriction: 'parent',
                restriction: computeRestriction
            },

            // minimum size
            restrictSize: {
                min: { width: 100, height: 50 },
            },

            inertia: false,

        })
        .on('dragmove',(event) => {

            console.log("dragmove: target: ", event.target);

            let target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';

            // update the position attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

        })
        .on('resizemove', function (event) {

            console.log("resizemove: target: ", event.target);

            // TODO: called when the element is resized.
            let target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            let box = {
                width: event.rect.width,
                height: event.rect.height
            };

            // update the element's style
            target.style.width  = `${box.width}px`;
            target.style.height = `${box.height}px`;

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

            target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);

        });
}

$(document).ready( () => {

    console.log("Ready now...");

    console.log("Interact setup!");
    // init("#pagemark0");
    // init("#pagemark1");

    init(".resize-drag");

});

