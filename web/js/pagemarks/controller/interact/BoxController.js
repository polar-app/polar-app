const interact = require("interactjs");
const {Rects} = require("../../../Rects");
const {Rect} = require("../../../Rect");
const {Objects} = require("../../../util/Objects");
const {DragRectAdjacencyCalculator} = require("./drag/DragRectAdjacencyCalculator");
const {ResizeRectAdjacencyCalculator} = require("./resize/ResizeRectAdjacencyCalculator");
const {BoxMoveEvent} = require("./BoxMoveEvent");
const {RectEdges} = require("./edges/RectEdges");
const {Preconditions} = require("../../../Preconditions");

/**
 * A generic controller for dragging boxes (divs) which are resizeable and can
 * be dragged within a container and absolutely positioned.
 */
class BoxController {

    /**
     *
     * @param [callback] {Function} Callback function which gives you a {BoxMoveEvent}
     */
    constructor(callback) {
        this.callback = callback;
    }

    /**
     * @param boxIdentifier {HTMLElement | string} A specific HTML element or a CSS selector.
     */
    register(boxIdentifier) {

        // TODO: we need a callback with:
        //
        // the parentRect (the container dimensions of the parent)
        // the boxRect (the position of the box after it was moved)
        //

        // TODO: assert that the boxes for the selector are ALREADY absolutely
        // positioned before we accept them and they are done using style
        // attributes.

        interact(boxIdentifier)
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

                let restrictionRect = Rects.createFromBasicRect({
                    left: 0,
                    top: 0,
                    width: target.parentElement.offsetWidth,
                    height: target.parentElement.offsetHeight
                });

                let origin = this._computeOriginXY(interactionEvent);

                let targetRect = Rects.fromElementStyle(target);

                let intersectedBoxes = this._calculateIntersectedBoxes(interactionEvent.currentTarget, Rects.createFromBasicRect({
                    left: origin.x,
                    top: origin.y,
                    width: targetRect.width,
                    height: targetRect.height
                }));

                let boxRect = Rects.createFromBasicRect({
                    left: origin.x,
                    top: origin.y,
                    width: targetRect.width,
                    height: targetRect.height
                });

                if(intersectedBoxes.intersectedRects.length === 0) {

                    console.log("NOT INTERSECTED");

                    console.log("Moving to origin: " + JSON.stringify(origin));
                    this._moveTargetElement(origin.x, origin.y, target);

                } else {

                    console.log("INTERSECTED========== ");

                    let primaryRect = Rects.createFromBasicRect({
                        left: origin.x,
                        top: origin.y,
                        width: targetRect.width,
                        height: targetRect.height
                    });

                    let intersectedRect = intersectedBoxes.intersectedRects[0];

                    let adjacency = DragRectAdjacencyCalculator.calculate(primaryRect, intersectedRect, restrictionRect);

                    let adjustedRect = adjacency.adjustedRect;

                    if(adjustedRect) {
                        this._moveTargetElement(adjustedRect.left, adjustedRect.top, target);
                        boxRect = adjustedRect;
                    } else {
                        // this should never happen but log it if there is a bug.
                        console.warn("Can't move due to no valid adjustedRect we can work with.");
                    }

                }

                this._fireBoxMoveEvent("drag", restrictionRect, boxRect, target.id, target);

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

                let restrictionRect = Rects.createFromBasicRect({
                    left: 0,
                    top: 0,
                    width: target.parentElement.offsetWidth,
                    height: target.parentElement.offsetHeight
                });

                // the tempRect is the rect that the user has attempted to draw
                // but which we have not yet accepted and is controlled by interact.js

                let tempRect = Rects.createFromBasicRect(interactionEvent.rect);

                let deltaRect = Rects.subtract(tempRect, interactionEvent.interaction.startRect);

                let resizeRect = Rects.add(interactionEvent.interaction.startTargetRect, deltaRect);

                // before we resize, verify that we CAN resize..

                let intersectedBoxes = this._calculateIntersectedBoxes(target, resizeRect);

                console.log("resizemove: deltaRect: " + JSON.stringify(deltaRect, null, "  "));

                let boxRect;

                if(intersectedBoxes.intersectedRects.length === 0) {

                    console.log("Resizing in non-intersected mode");

                    boxRect = resizeRect;

                    this._resizeTargetElement(resizeRect, target);

                } else {

                    // FIXME: its' also possible to resize smaller than the minSize we defined above...

                    // FIXME: when intersected, if we drag down, the rect vanishes...
                    //
                    // FIXME: pulling it left while intersected also makes it vanish...

                    console.log("Resizing in intersected mode");

                    let resizeRectAdjacencyCalculator = new ResizeRectAdjacencyCalculator();

                    let intersectedRect = intersectedBoxes.intersectedRects[0];

                    let rectEdges = new RectEdges(interactionEvent.edges);

                    let adjustedRect = resizeRectAdjacencyCalculator.calculate(resizeRect, intersectedRect, rectEdges);

                    console.log("resizemove: adjustedRect: " + JSON.stringify(adjustedRect, null, "  "));

                    boxRect = adjustedRect;

                    this._resizeTargetElement(adjustedRect, target);

                }

                this._fireBoxMoveEvent("resize", restrictionRect, boxRect, target.id, target);

            });

    }

    /**
     *
     * @param type {String} "drag" or "resize"
     * @param restrictionRect {Rect}
     * @param boxRect {Rect}
     * @param id {String}
     * @param target {HTMLElement}
     * @private
     */
    _fireBoxMoveEvent(type, restrictionRect, boxRect, id, target) {

        let boxMoveEvent = new BoxMoveEvent({
            type,
            restrictionRect,
            boxRect,
            id,
            target,
        });

        if(this.callback) {
            this.callback(boxMoveEvent);
        }

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
        let boxes = Array.from(element.parentElement.querySelectorAll(".pagemark"))
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
