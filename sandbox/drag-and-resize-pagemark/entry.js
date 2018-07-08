const interact = require("interactjs");
const $ = require("jquery");
const assert = require("assert");
const {Rects} = require("../../web/js/Rects");
const {Objects} = require("../../web/js/util/Objects");
const {Styles} = require("../../web/js/util/Styles");
const {assertJSON} = require("../../web/js/test/Assertions");
const {Rect} = require("../../web/js/Rect");
const {RectAdjacencyCalculator} = require("../../web/js/pagemarks/view/adjacency/RectAdjacencyCalculator");


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

    result.left = Math.max(parentRect.left, Math.max(intersectingRects.map(intersectingRect => intersectingRect.right)));
    result.right = Math.min(parentRect.right, Math.min(intersectingRects.map(intersectingRect => intersectingRect.left)));
    result.top = Math.max(parentRect.top, Math.max(intersectingRects.map(intersectingRect => intersectingRect.bottom)));
    result.bottom = Math.min(parentRect.bottom, Math.min(intersectingRects.map(intersectingRect => intersectingRect.top)));

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
    target.style.width  = `${box.width}px`;
    target.style.height = `${box.height}px`;

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
        .on('dragstart',(interactionEvent) => {
            interactionEvent.interaction.targetStartRect = Rects.fromElementStyle(interactionEvent.target);
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

            let delta = {
                x: interactionEvent.pageX - interactionEvent.interaction.startCoords.page.x,
                y: interactionEvent.pageY - interactionEvent.interaction.startCoords.page.y
            };

            // console.log(`dragmove: delta.x: ${delta.x} and delta.y: ${delta.y}`);

            //console.log(`dragmove: event.interaction.startCoords.page: ` + JSON.stringify(event.interaction.startCoords.page) );
            //
            // console.log(`dragmove: testDelta: ` + JSON.stringify(delta));

            //
            // // FIXME: ahah! here is the bug... the deltaX grows vs the original position
            // // but I'm continuing to update it!!!
            //
            let x = interactionEvent.interaction.targetStartRect.left + delta.x;
            let y = interactionEvent.interaction.targetStartRect.top + delta.y;

            // console.log("dragmove: x: ${x} and y: ${y}");

            let intersectedPagemarks = calculateIntersectedPagemarks(x, y, interactionEvent.currentTarget);

            let targetRect = Rects.fromElementStyle(target);

            if(intersectedPagemarks.intersectedRects.length === 0) {

                moveTargetElement(x, y, target);

            } else {

                // FIXME: the target rect should be INSIDE not outside.. this isn't helping..

                let primaryRect = Rects.createFromBasicRect({
                    left: x,
                    top: y,
                    width: targetRect.width,
                    height: targetRect.height
                });

                let adjacency = RectAdjacencyCalculator.calculate(primaryRect, intersectedPagemarks.intersectedRects[0]);

                let adjustedRect = adjacency.adjustedRect;

                moveTargetElement(adjustedRect.left, adjustedRect.top, target);

            }

        })
        .on('resizestart', interactionEvent => {
            interactionEvent.interaction.targetStartRect = Rects.fromElementStyle(interactionEvent.target);
        })
        .on('resizemove', interactionEvent => {

            console.log("resizemove: event: ", interactionEvent);
            console.log("resizemove: event.target: ", interactionEvent.target);
            console.log("resizemove: event.restrict: ", interactionEvent.restrict);

            // TODO: called when the element is resized.
            let target = interactionEvent.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            let box = {
                width: interactionEvent.rect.width,
                height: interactionEvent.rect.height
            };

            // update the element's style
            target.style.width  = `${box.width}px`;
            target.style.height = `${box.height}px`;

            // translate when resizing from top or left edges
            x += interactionEvent.deltaRect.left;
            y += interactionEvent.deltaRect.top;

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

