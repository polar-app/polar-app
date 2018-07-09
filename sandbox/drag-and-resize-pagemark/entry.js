const interact = require("interactjs");
const $ = require("jquery");
const assert = require("assert");
const {Rects} = require("../../web/js/Rects");
const {Objects} = require("../../web/js/util/Objects");
const {Styles} = require("../../web/js/util/Styles");
const {assertJSON} = require("../../web/js/test/Assertions");
const {Rect} = require("../../web/js/Rect");
const {RectAdjacencyCalculator} = require("../../web/js/pagemarks/view/adjacency/RectAdjacencyCalculator");
const {RectResizeAdjacencyCalculator} = require("../../web/js/pagemarks/view/adjacency/RectResizeAdjacencyCalculator");

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

    // make sure that our pagemarks aren't the same ID as the element. we can
    // remove this when we go to production
    pagemarks.forEach(current => current.getAttribute("id") !== element.getAttribute("id"));

    let intersectedRects = [];

    pagemarks.forEach(pagemark => {

        let pagemarkRect = Rects.fromElementStyle(pagemark);

        if(Rects.intersect(pagemarkRect, elementRect)) {
            intersectedRects.push(pagemarkRect);
        }

    });

    return {
        elementRect,
        intersectedRects
    }

}

function updateTargetText(target) {

    target.textContent = JSON.stringify(Rects.fromElementStyle(target), null, "  ");

}

function moveTargetElement(x, y, target) {

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    //updateTargetText(target);

}

function resizeTargetElement(rect, target) {

    // first move it the same way as if it were dragged
    moveTargetElement(rect.left, rect.top, target);

    // now set the width and height
    target.style.width  = `${rect.width}px`;
    target.style.height = `${rect.height}px`;

}

function captureStartTargetRect(interactionEvent) {
    interactionEvent.interaction.startTargetRect = Rects.fromElementStyle(interactionEvent.target);
}

function computeOriginXY(interactionEvent) {

    let delta = {
        x: interactionEvent.pageX - interactionEvent.interaction.startCoords.page.x,
        y: interactionEvent.pageY - interactionEvent.interaction.startCoords.page.y
    };

    // console.log(`dragmove: delta.x: ${delta.x} and delta.y: ${delta.y}`);
    // console.log(`dragmove: interactionEvent.interaction.startCoords.page: ` + JSON.stringify(interactionEvent.interaction.startCoords.page) );
    // console.log(`dragmove: testDelta: ` + JSON.stringify(delta));

    let x = interactionEvent.interaction.startTargetRect.left + delta.x;
    let y = interactionEvent.interaction.startTargetRect.top + delta.y;

    return {x, y};

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

            restrict: {
                restriction: 'parent',
                // restriction: computeRestriction
            },

            // minimum size
            restrictSize: {
                min: { width: 50, height: 50 },
            },

            inertia: false,

        })
        .on('dragstart',(interactionEvent) => {
            captureStartTargetRect(interactionEvent);
        })
        .on('dragmove',(interactionEvent) => {

            // console.log("=====================")
            // console.log("dragmove: event: ", event);
            // console.log("dragmove: event.interaction.myTimestamp: ", event.interaction.myTimestamp);
            // console.log("dragmove: event.target: ", event.target);
            // console.log("dragmove: event.restrict: ", event.restrict);
            // console.log(`dragmove: event.dx: ${event.dx} and event.dy: ${event.dy}`);
            // console.log(`dragmove: event.x0: ${event.x0} and event.y0: ${event.y0}`);
            // console.log(`dragmove: event.clientX: ${event.clientX} and event.clientY: ${event.clientY}`);
            // console.log(`dragmove: event.clientX0: ${event.clientX0} and event.clientY0: ${event.clientY0}`);

            let target = interactionEvent.target;

            let origin = computeOriginXY(interactionEvent);

            let intersectedPagemarks = calculateIntersectedPagemarks(origin.x, origin.y, interactionEvent.currentTarget);

            let targetRect = Rects.fromElementStyle(target);

            // FIXME: dragging to the side now causes an exception to be thrown

            if(intersectedPagemarks.intersectedRects.length === 0) {

                console.log("NOT INTERSECTED");

                console.log("Moving to origin: " + JSON.stringify(origin));
                moveTargetElement(origin.x, origin.y, target);

            } else {

                console.log("INTERSECTED");

                let primaryRect = Rects.createFromBasicRect({
                    left: origin.x,
                    top: origin.y,
                    width: targetRect.width,
                    height: targetRect.height
                });

                let intersectedRect = intersectedPagemarks.intersectedRects[0];

                let restrictionRect = Rects.createFromBasicRect({
                    left: 0,
                    top: 0,
                    width: target.parentElement.offsetWidth,
                    height: target.parentElement.offsetHeight
                });

                let adjacency = RectAdjacencyCalculator.calculate(primaryRect, intersectedRect, restrictionRect);

                let adjustedRect = adjacency.adjustedRect;

                if(adjustedRect) {
                    moveTargetElement(adjustedRect.left, adjustedRect.top, target);
                } else {
                    console.warn("Can't move due to no valid adjustedRect we can work with.")
                }

            }

        })
        .on('resizestart', interactionEvent => {
            captureStartTargetRect(interactionEvent);
            console.log("resizestart: interactionEvent.rect: " + JSON.stringify(interactionEvent.rect, null, "  "));
            interactionEvent.interaction.startRect = Objects.duplicate(interactionEvent.rect);

        })
        .on('resizemove', interactionEvent => {

            console.log("resizemove: event: ", interactionEvent);
            console.log("resizemove: event.target: ", interactionEvent.target);
            console.log("resizemove: event.restrict: ", interactionEvent.restrict);
            console.log("resizemove: interactionEvent.rect: " + JSON.stringify(interactionEvent.rect, null, "  "));
            console.log("resizemove: interactionEvent.interaction.startRect: " + JSON.stringify(interactionEvent.interaction.startRect, null, "  "));

            let target = interactionEvent.target;

            // the resizeRect is the rect that the user has attempted to draw
            // but which we have not yet accepted and is controlled by interact.js
            let resizeRect = Rects.createFromBasicRect(interactionEvent.rect);

            let deltaRect = Rects.subtract(resizeRect, interactionEvent.interaction.startRect);

            // position the rect properly vs the delta
            let positionedRect = Rects.add(interactionEvent.interaction.startTargetRect, deltaRect);

            // before we resize, verify that we CAN resize..

            // FIXME: another option, find the first div we enter, then resize
            // to connect it, but don't resize again until we leave it...

            // FIXME: when I'm resizing on ONE axis only adjust the adjacency
            // of one and note that interactjs allows us to adjust two at once...
            // I think what we need to do is preserve the origin that it's
            // resizing from and that would handle this case.

            // FIXME: when we adjust the sizing of the rect.. we actually have
            // to do it differently and NOT use the calculator I think.. We have
            // to find out which direction the rect we intersected at lives, and just
            // truncate at that position during the move..
            let intersectedPagemarks = calculateIntersectedPagemarks(positionedRect.left, positionedRect.top, target);

            console.log("resizemove: deltaRect: " + JSON.stringify(deltaRect, null, "  "));

            // FIXME:
            //
            //
            // - when we are intersected on the left, we can't expand on the right.

            if(intersectedPagemarks.intersectedRects.length === 0) {

                resizeTargetElement(positionedRect, target);

            } else {

                // FIXME use positionedRect not resizeRect

                // this is still a bit difficult to implement.  my thinking at the
                // time was to figure out which direction the mouse is primarily
                // moving OR where the rect was BEFORE it intersected and then
                // figure out side took up the largest side vs what it's about
                // to collide into.  Either that or compute a derived rect
                // from the intersected rect and then figure out if the height
                // is more than the width and then go with whichever is higher.

                let rectResizeAdjacencyCalculator = new RectResizeAdjacencyCalculator();

                let intersectedRect = intersectedPagemarks.intersectedRects[0];

                let adjustedRect = rectResizeAdjacencyCalculator.calculate(positionedRect, intersectedRect);

                resizeTargetElement(adjustedRect, target);

            }

        });
}

$(document).ready( () => {

    console.log("Ready now...");

    console.log("Interact setup!");
    // init("#pagemark0");
    // init("#pagemark1");

    init(".resize-drag");

});

