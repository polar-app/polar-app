const interact = require("interactjs");
const {Rects} = require("../../../Rects");
const {Rect} = require("../../../Rect");
const {Objects} = require("../../../util/Objects");
const {DragRectAdjacencyCalculator} = require("../../../pagemarks/view/interact/drag/DragRectAdjacencyCalculator");
const {ResizeRectAdjacencyCalculator} = require("../../../pagemarks/view/interact/resize/ResizeRectAdjacencyCalculator");
const {RectEdges} = require("../../../pagemarks/view/interact/edges/RectEdges");
const {Preconditions} = require("../../../Preconditions");

/**
 * A generic controller for dragging boxes (divs) which are resizeable and can
 * be dragged within a container and absolutely positioned.
 */
class BoxController {

    constructor(selector) {
        // TODO: we will probably have to register new
        this.selector = selector;
    }

    init() {

        // TODO: assert that the boxes for the selector are ALREADY absolutely
        // positioned

        interact(this.selector)
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
                this._captureStartTargetRect(interactionEvent);
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

                let origin = this._computeOriginXY(interactionEvent);

                let targetRect = Rects.fromElementStyle(target);

                let intersectedBoxes = this._calculateIntersectedBoxes(interactionEvent.currentTarget, Rects.createFromBasicRect({
                    left: origin.x,
                    top: origin.y,
                    width: targetRect.width,
                    height: targetRect.height
                }));

                if(intersectedBoxes.intersectedRects.length === 0) {

                    console.log("NOT INTERSECTED");

                    console.log("Moving to origin: " + JSON.stringify(origin));
                    this._moveTargetElement(origin.x, origin.y, target);

                } else {

                    console.log("INTERSECTED");

                    let primaryRect = Rects.createFromBasicRect({
                        left: origin.x,
                        top: origin.y,
                        width: targetRect.width,
                        height: targetRect.height
                    });

                    let intersectedRect = intersectedBoxes.intersectedRects[0];

                    let restrictionRect = Rects.createFromBasicRect({
                        left: 0,
                        top: 0,
                        width: target.parentElement.offsetWidth,
                        height: target.parentElement.offsetHeight
                    });

                    let adjacency = DragRectAdjacencyCalculator.calculate(primaryRect, intersectedRect, restrictionRect);

                    let adjustedRect = adjacency.adjustedRect;

                    if(adjustedRect) {
                        this._moveTargetElement(adjustedRect.left, adjustedRect.top, target);
                    } else {

                        // FIXME: if we resize slightly..it triggers this code and
                        // the adjustment doesn't work.

                        console.warn("Can't move due to no valid adjustedRect we can work with.");

                        console.log("FIXME: primaryRect: " + JSON.stringify(primaryRect, null, "  "));
                        console.log("FIXME: intersectedRect: " + JSON.stringify(intersectedRect, null, "  "));
                        console.log("FIXME: restrictionRect: " + JSON.stringify(restrictionRect, null, "  "));

                        // FIXME: the invisible rect resize problem still remains...
                        //
                        //        - it happens when we're to the RIGHT of the intersect
                        //          and we try to resize in two dimensions.


                        // looks like it happens when the primary is too large...

                        // FIXME: primaryRect: {
                        //     "left": 291,
                        //         "top": 133,
                        //         "right": 523,
                        //         "bottom": 366,
                        //         "width": 232,
                        //         "height": 233
                        // }
                        // entry.js:233 FIXME: intersectedRect: {
                        //     "left": 170,
                        //         "top": 162,
                        //         "right": 370,
                        //         "bottom": 362,
                        //         "width": 200,
                        //         "height": 200
                        // }
                        // entry.js:234 FIXME: restrictionRect: {
                        //     "left": 0,
                        //         "top": 0,
                        //         "right": 800,
                        //         "bottom": 500,
                        //         "width": 800,
                        //         "height": 500
                        // }

                    }

                }

            })
            .on('resizestart', interactionEvent => {
                this._captureStartTargetRect(interactionEvent);
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

                // the tempRect is the rect that the user has attempted to draw
                // but which we have not yet accepted and is controlled by interact.js

                let tempRect = Rects.createFromBasicRect(interactionEvent.rect);

                let deltaRect = Rects.subtract(tempRect, interactionEvent.interaction.startRect);

                let resizeRect = Rects.add(interactionEvent.interaction.startTargetRect, deltaRect);

                // before we resize, verify that we CAN resize..

                let intersectedBoxes = this._calculateIntersectedBoxes(target, resizeRect);

                console.log("resizemove: deltaRect: " + JSON.stringify(deltaRect, null, "  "));

                if(intersectedBoxes.intersectedRects.length === 0) {

                    console.log("Resizing in non-intersected mode");

                    this._resizeTargetElement(resizeRect, target);

                } else {

                    console.log("Resizing in intersected mode");

                    let resizeRectAdjacencyCalculator = new ResizeRectAdjacencyCalculator();

                    let intersectedRect = intersectedBoxes.intersectedRects[0];

                    let rectEdges = new RectEdges(interactionEvent.edges);

                    let adjustedRect = resizeRectAdjacencyCalculator.calculate(resizeRect, intersectedRect, rectEdges);

                    console.log("resizemove: adjustedRect: " + JSON.stringify(adjustedRect, null, "  "));

                    this._resizeTargetElement(adjustedRect, target);

                }

            });
    }

    /**
     */
    _calculateIntersectedBoxes(element, resizeRect) {

        Preconditions.assertNotNull(element, "element");
        Preconditions.assertNotNull(resizeRect, "resizeRect");

        // // This is where we are NOW, now where we are GOING to be.
        // let elementRect = Rects.fromElementStyle(element);

        // console.log(`x: ${x}: y: ${y}`);
        console.log("_calculateIntersectedBoxes: resizeRect is: " + JSON.stringify(resizeRect, null, "  "));

        let doc = element.ownerDocument;
        let boxes = Array.from(doc.querySelectorAll(".pagemark"))
                             .filter( current => current !== element);

        // make sure that our boxes aren't the same ID as the element. we can
        // remove this when we go to production
        boxes.forEach(current => current.getAttribute("id") !== element.getAttribute("id"));

        let intersectedRects = [];

        boxes.forEach(box => {

            let pagemarkRect = Rects.fromElementStyle(box);

            if(Rects.intersect(pagemarkRect, resizeRect)) {
                intersectedRects.push(pagemarkRect);
            }

        });

        return {
            resizeRect,
            intersectedRects
        }

    }

    /**
     *
     * @param interactionEvent
     * @private
     */
    _computeOriginXY(interactionEvent) {

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


    /**
     *
     * @param x {number}
     * @param y {number}
     * @param target
     * @private
     */
    _moveTargetElement(x, y, target) {

        target.style.left = `${x}px`;
        target.style.top = `${y}px`;

        // update the position attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        //updateTargetText(target);

    }

    /**
     *
     * @param rect {Rect}
     * @param target {HTMLElement}
     * @private
     */
    _resizeTargetElement(rect, target) {

        // first move it the same way as if it were dragged
        this._moveTargetElement(rect.left, rect.top, target);

        // now set the width and height
        target.style.width  = `${rect.width}px`;
        target.style.height = `${rect.height}px`;

    }

    _captureStartTargetRect(interactionEvent) {
        interactionEvent.interaction.startTargetRect = Rects.fromElementStyle(interactionEvent.target);
    }

}

module.exports.BoxController = BoxController;
