const interact = require("interactjs");
const $ = require("jquery");
const {Rects} = require("../../web/js/Rects");
const {Objects} = require("../../web/js/util/Objects");

// this is used later in the resizing and gesture demos
//window.dragMoveListener = dragMoveListener;

class RestrictionRectCalculator {

    // calculateField(parentRect, intersectingRects, name, vsName, reducerFunc) {
    //     Math.max(parentRect.left, Math.max(intersectingRects.map(intersectingRect => intersectingRect.right)))
    // }

}

function computeBoundingRect(parentRect, elementOrigin, intersectingRects) {

    console.log("Working with intersecting rects: " + JSON.stringify(intersectingRects, null, "  ") );

    let result = Objects.duplicate(parentRect);

    // FIXME: clean this up a bit.
    // FIXME: MOVE doesn't work!

    result.left = Math.max(parentRect.left, Math.max(intersectingRects.map(intersectingRect => intersectingRect.right)));
    result.right = Math.min(parentRect.right, Math.min(intersectingRects.map(intersectingRect => intersectingRect.left)));

    return result;
}

function calculateIntersectedPagemarks(clientX, clientY, element) {

    if(! element) {
        throw new Error("No element");
    }

    let elementRect = element.getBoundingClientRect();

    console.log("elementRect is now: " + JSON.stringify(elementRect, null, "  "));

    elementRect.left = clientX;
    elementRect.top = clientY;
    elementRect.right = elementRect.left + elementRect.width;
    elementRect.bottom = elementRect.top + elementRect.height;

    console.log("elementRect is now (after mutation): " + JSON.stringify(elementRect, null, "  "));


    let doc = element.ownerDocument;
    let pagemarks = Array.from(doc.querySelectorAll(".pagemark"))
                                  .filter( current => current !== element);

    return pagemarks.filter(current => Rects.intersect(current.getBoundingClientRect(), elementRect));

}

function computeRestriction(x,y, interactionEvent) {

    let element = interactionEvent.element;

    if(! element) {
        throw new Error("No element");
    }

    let parentElement = element.parentElement;

    if(! parentElement) {
        throw new Error("No parentElement");
    }

    let elementRect = element.getBoundingClientRect();
    let parentRect = parentElement.getBoundingClientRect();

    // TODO: this needs to be PAGE local.. not the entire document.
    let pagemarks = Array.from(document.querySelectorAll(".pagemark"))
                            .filter( current => current !== element);

    let intersectedPagemarks =
        pagemarks.filter(current => Rects.intersect(current.getBoundingClientRect(), elementRect));

    let intersectedPagemarkRects =
        intersectedPagemarks.map(current => current.getBoundingClientRect());

    if(intersectedPagemarks.length > 0) {

        console.log("FIXME: we intersect with N pagemarks: " + intersectedPagemarks.length);

        let restrictedRect = computeBoundingRect(parentRect, {x: 10, y: 10}, intersectedPagemarkRects);

        console.log("FIXME: returning restrictedRect: " + JSON.stringify(restrictedRect, null, "  "));

        return restrictedRect;
        //
        // //return {left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0};
        // let testRect = Objects.duplicate(parentRect);
        // testRect.right = testRect.left;
        // testRect.bottom = testRect.top;
        // testRect.height = 0;
        // testRect.width = 0;
        // return testRect;

    } else {
        return parentRect;

    }


    //
    // // TODO make this testable by immediately converting to rects and then
    // // working with them directly.
    //
    // // FIXME: this actually DOES work to implement the restriction properly...
    // // rect.height = rect.height - 100;
    // // rect.bottom = rect.bottom - 100;
    //
    // // TODO: this needs to be PAGE local.. not the entire document.
    // let pagemarks = document.querySelectorAll(".pagemark")
    //                         .filter( current => current !== element);
    //
    // let intersectedPagemarks =
    //     pagemarks.filter(current => Rects.intersect(current.getBoundingClientRect(), elementRect));
    //
    // console.log("FIXME: we intersect with N pagemarks: " + intersectedPagemarks.length);
    //
    // // find pagemarks that I intersect with..
    //
    //
    // // if we have too many elements at the point then we should just return the
    // // current element's bounding rect to prevent it from growing.
    // let elementsFromPoint = document.elementsFromPoint(x,y);
    //
    // let filteredElements = elementsFromPoint.filter( current => current.matches(".pagemark"))
    //
    // // FIXME: this isn't going to work because what happens when we're on the
    // // OTHER side of a rect!!!  plus we can SWALLOW a rect and expand past it!
    // //
    // // fuck.. this is actually a difficult problem.
    //
    // // FIXME: what if we just compute the union for box and them compute the
    // // bounding box base on the union of the virtual rects its interacting
    // // with.
    //
    // if(filteredElements.length === 0) {
    //     console.log("Using default parent rect");
    //     return rect;
    // } else if (filteredElements.length === 1){
    //     console.log("Using custom bounded rect");
    //
    //     return {top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0};
    //
    //     //return rect;
    // } else {
    //     log.error("Too many filtered elements found: ", filteredElements);
    //     throw new Error("Too many filtered elements found: " + filteredElements.length)
    // }

}

function init(selector) {

    // FIXME: redesign this:
    //
    // - the restrictions should just do simple parent restrictions
    // - all the code should be done within the moiving logic.



    interact(selector)
        .draggable({
            restrict: {
                restriction: "parent",
                // elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
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
                outer: 'parent',
                // outer: computeRestriction,
            },

            restrictSize: {
                outer: 'parent',
                // outer: computeRestriction,
            },

            // FIXME: move doesn't use restrictions...

            restrict: {
                restriction: 'parent',
                // restriction: computeRestriction
            },

            // minimum size
            // restrictSize: {
            //     min: { width: 100, height: 50 },
            // },

            inertia: false,

        })
        .on('dragmove',(event) => {

            console.log("dragmove: event: ", event);
            console.log("dragmove: event.target: ", event.target);
            console.log("dragmove: event.restrict: ", event.restrict);

            // FIXME: AHA!  what's happening is that the element hasn't updated
            // yet, so we are looking at the current position, not the NEXT
            // position, and then when we calculate the intersection there is
            // nothing at the current position but it WUILL be ther e in the future
            // once we move it.
            let intersectedPagemarks = calculateIntersectedPagemarks(event.clientX, event.clientY, event.currentTarget);

            if(intersectedPagemarks.length === 0) {

                // FIXME: could I try to take the position from a derived dx and dy?

                //

                // FIXME: now the issue is that the translate() calculation is off
                // SLIGHTLYU and it's keeping us locked...

                // FIXME: can I translate the two positions??? like the position
                // where it WOULD be?

                // FIXME: I don't think we can trust event.dx or dy

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

                let targetRect = target.getBoundingClientRect();

                console.log("FIXME: placed rect at: " + JSON.stringify(targetRect, null, "  "));

                let intersectedPagemarks = calculateIntersectedPagemarks(targetRect.left, targetRect.top, event.currentTarget);

                if(intersectedPagemarks.length !== 0) {
                    console.error("Now we are intersected! shit!");
                }

            } else {
                console.log("Will not drag.. intersects with: ", intersectedPagemarks);
            }

        })
        .on('resizemove', function (event) {

            console.log("resizemove: event: ", event);

            console.log("resizemove: event.target: ", event.target);
            console.log("resizemove: event.restrict: ", event.restrict);

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

