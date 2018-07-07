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


    // if we have too many elements at the point then we should just return the
    // current element's bounding rect to prevent it from growing.
    let elementsFromPoint = document.elementsFromPoint(x,y);

    let filteredElements = elementsFromPoint.filter( current => current.matches(".pagemark"))
                                            .filter( current => current !== element);

    // FIXME: this isn't going to work because what happens when we're on the
    // OTHER side of a rect!!!  plus we can SWALLOW a rect and expand past it!
    //
    // fuck.. this is actually a difficult problem.

    // FIXME: what if we just compute the union for box and them compute the
    // bounding box base on the union of the virtual rects its interacting
    // with.

    if(filteredElements.length === 0) {
        console.log("Using default parent rect");
        return rect;
    } else if (filteredElements.length === 1){
        console.log("Using custom bounded rect");

        return {top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0};

        //return rect;
    } else {
        log.error("Too many filtered elements found: ", filteredElements);
        throw new Error("Too many filtered elements found: " + filteredElements.length)
    }

}

function init(selector) {

    interact(selector)
        .draggable({
            restrict: {
                restriction: computeRestriction,
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

            restrictSize: {
                //outer: 'parent',
                outer: computeRestriction,
            },

            // FIXME: move doesn't use restrictions...

            restrict: {
                //restriction: 'parent',
                restriction: computeRestriction
            },

            // minimum size
            // restrictSize: {
            //     min: { width: 100, height: 50 },
            // },

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

