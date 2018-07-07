const interact = require("interactjs");
const $ = require("jquery");
const assert = require("assert");
const {Rects} = require("../../web/js/Rects");
const {Objects} = require("../../web/js/util/Objects");
const {Styles} = require("../../web/js/util/Styles");
const {assertJSON} = require("../../web/js/test/Assertions");

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

/**
 */
function calculateIntersectedPagemarks(x, y, element) {

    if(! element) {
        throw new Error("No element");
    }

    // This is where we are NOW, now where we are GOING to be.
    let elementRect = Rects.fromElementStyle(element);

    console.log(`x: ${x}: y: ${y}`);
    console.log("elementRect is now: " + JSON.stringify(elementRect, null, "  "));

    elementRect.left = x;
    elementRect.top = y;
    elementRect.right = elementRect.left + elementRect.width;
    elementRect.bottom = elementRect.top + elementRect.height;

    console.log("elementRect is now (after mutation): " + JSON.stringify(elementRect, null, "  "));

    let doc = element.ownerDocument;
    let pagemarks = Array.from(doc.querySelectorAll(".pagemark"))
                                  .filter( current => current !== element);

    // FIXME: make sure that our pagemarks aren't the same ID as the element.
    // we can remove this when we go to production
    pagemarks.forEach(current => current.getAttribute("id") !== element.getAttribute("id"));

    let intersected = pagemarks.filter(current => Rects.intersect(Rects.fromElementStyle(current), elementRect));

    return {
        elementRect,
        intersected
    }

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

function updateTargetText(target) {

    target.textContent = JSON.stringify(Rects.fromElementStyle(target), null, "  ");

}

function init(selector) {

    // FIXME: redesign this:
    //
    // - the restrictions should just do simple parent restrictions
    // - all the code should be done within the moiving logic.



    interact(selector)
        .draggable({

            inertia: false,
            restrict: {
                restriction: "parent",
                outer: 'parent',

                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },

            restrictEdges: {
                outer: 'parent',
                // outer: computeRestriction,
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
        .on('dragstart',(event) => {

            console.log("=====================")
            console.log("dragstart: event: ", event);

            event.interaction.myTimestamp = new Date().toISOString();

            let target = event.target;

            event.interaction.startRect = Rects.fromElementStyle(target);

        })
        .on('dragmove',(event) => {

            // FIXME: the offset is CONSISTENT...

            // FIXME: I might have to use 'dragstart' to record the origin
            // positions of the mouse as I THINK the

            // FUCK.. we are still jumping around.. I think this library was
            // designed to update EVERY time...

            console.log("=====================")
            console.log("dragmove: event: ", event);
            console.log("dragmove: event.interaction.myTimestamp: ", event.interaction.myTimestamp);
            // console.log("dragmove: event.target: ", event.target);
            // console.log("dragmove: event.restrict: ", event.restrict);
            //
            // // FIXME: ok.. event.dx and event.dy CAN NOT be used because it is
            // // from the LAST position that dragmove was called...
            // console.log(`dragmove: event.dx: ${event.dx} and event.dy: ${event.dy}`);
            // console.log(`dragmove: event.x0: ${event.x0} and event.y0: ${event.y0}`);

            console.log(`dragmove: event.clientX: ${event.clientX} and event.clientY: ${event.clientY}`);
            console.log(`dragmove: event.clientX0: ${event.clientX0} and event.clientY0: ${event.clientY0}`);

            let target = event.target;

            // we have to use the target rect because it MAY be stable and then
            // we have to compute the delta vs the current position.
            let targetRect = target.getBoundingClientRect();

            // let deltaX = event.clientX - event.clientX0;
            // let deltaY = event.clientY - event.clientY0;

            // let deltaX = event.clientX - targetRect.left;
            // let deltaY = event.clientY - targetRect.top;
            //

            let delta = {
                x: event.pageX - event.interaction.startCoords.page.x,
                y: event.pageY - event.interaction.startCoords.page.y
            }

            console.log(`dragmove: delta.x: ${delta.x} and delta.y: ${delta.y}`);

            //console.log(`dragmove: event.interaction.startCoords.page: ` + JSON.stringify(event.interaction.startCoords.page) );

            console.log(`dragmove: testDelta: ` + JSON.stringify(delta));

            //
            // // FIXME: ahah! here is the bug... the deltaX grows vs the original position
            // // but I'm continuing to update it!!!
            //
            let x = event.interaction.startRect.left + delta.x;
            let y = event.interaction.startRect.top + delta.y;

            console.log("dragmove: x: ${x} and y: ${y}");
            //
            // // translate the element
            // // target.style.webkitTransform =
            // //     target.style.transform =
            // //         'translate(' + x + 'px, ' + y + 'px)';
            //
            // target.style.left = `${x}px`;
            // target.style.top = `${y}px`;
            //
            // // update the position attributes
            // target.setAttribute('data-x', x);
            // target.setAttribute('data-y', y);


            let intersectedPagemarks = calculateIntersectedPagemarks(x, y, event.currentTarget);


            if(intersectedPagemarks.intersected.length === 0) {

                target.style.left = `${x}px`;
                target.style.top = `${y}px`;

                // update the position attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);

                let targetRect = Rects.fromElementStyle(target);

                console.log("FIXME: placed rect at: " + JSON.stringify(targetRect, null, "  "));

                // now assert that the place we dropped is the place we expected
                // it to be dropped

                assertJSON(intersectedPagemarks.elementRect, targetRect);

                intersectedPagemarks = calculateIntersectedPagemarks(x, y, event.currentTarget);

                if(intersectedPagemarks.intersected.length !== 0) {
                    console.error("Now we are intersected! shit!");
                }

                updateTargetText(target);

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

            updateTargetText(target);

        });
}

$(document).ready( () => {

    console.log("Ready now...");

    console.log("Interact setup!");
    // init("#pagemark0");
    // init("#pagemark1");

    init(".resize-drag");

});

