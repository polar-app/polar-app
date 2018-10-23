"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BoxMoveEvent_1 = require("./BoxMoveEvent");
const BoxOptions_1 = require("./BoxOptions");
const Rects_1 = require("../../Rects");
const Objects_1 = require("../../util/Objects");
const Logger_1 = require("../../logger/Logger");
const Preconditions_1 = require("../../Preconditions");
const RectEdges_1 = require("../../pagemarks/controller/interact/edges/RectEdges");
const Optional_1 = require("../../util/ts/Optional");
const interact = require('interactjs');
const { DragRectAdjacencyCalculator } = require("../../pagemarks/controller/interact/drag/DragRectAdjacencyCalculator");
const { ResizeRectAdjacencyCalculator } = require("../../pagemarks/controller/interact/resize/ResizeRectAdjacencyCalculator");
const log = Logger_1.Logger.create();
class BoxController {
    constructor(callback) {
        this.callback = callback;
    }
    register(opts) {
        let boxOptions = new BoxOptions_1.BoxOptions(opts);
        let restrictionElement = Optional_1.Optional.of(boxOptions.restrictionElement)
            .getOrElse(boxOptions.target.parentElement);
        interact(boxOptions.target)
            .draggable({
            inertia: false,
            restrict: {
                restriction: restrictionElement,
                outer: 'parent',
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            restrictEdges: {
                outer: 'parent',
            },
        })
            .resizable({
            edges: {
                left: true,
                right: true,
                bottom: true,
                top: true
            },
            restrictEdges: {
                outer: restrictionElement,
            },
            restrict: {
                restriction: restrictionElement,
            },
            restrictSize: {
                min: { width: 50, height: 50 },
            },
            inertia: false,
        })
            .on('dragstart', (interactionEvent) => {
            this._captureStartTargetRect(interactionEvent);
        })
            .on('dragmove', (interactionEvent) => {
            let target = interactionEvent.target;
            let restrictionRect = Rects_1.Rects.createFromBasicRect({
                left: 0,
                top: 0,
                width: restrictionElement.offsetWidth,
                height: restrictionElement.offsetHeight
            });
            let origin = this._computeOriginXY(interactionEvent);
            let targetRect = Rects_1.Rects.fromElementStyle(target);
            let intersectedBoxes = this._calculateIntersectedBoxes(interactionEvent.currentTarget, Rects_1.Rects.createFromBasicRect({
                left: origin.x,
                top: origin.y,
                width: targetRect.width,
                height: targetRect.height
            }), boxOptions.intersectedElementsSelector);
            let boxRect = Rects_1.Rects.createFromBasicRect({
                left: origin.x,
                top: origin.y,
                width: targetRect.width,
                height: targetRect.height
            });
            if (intersectedBoxes.intersectedRects.length === 0) {
                log.info("NOT INTERSECTED");
                log.info("Moving to origin: " + JSON.stringify(origin));
                this._moveTargetElement(origin.x, origin.y, target);
            }
            else {
                log.info("INTERSECTED========== ");
                let primaryRect = Rects_1.Rects.createFromBasicRect({
                    left: origin.x,
                    top: origin.y,
                    width: targetRect.width,
                    height: targetRect.height
                });
                let intersectedRect = intersectedBoxes.intersectedRects[0];
                let adjacency = DragRectAdjacencyCalculator.calculate(primaryRect, intersectedRect, restrictionRect);
                let adjustedRect = adjacency.adjustedRect;
                if (adjustedRect) {
                    this._moveTargetElement(adjustedRect.left, adjustedRect.top, target);
                    boxRect = adjustedRect;
                }
                else {
                    console.warn("Can't move due to no valid adjustedRect we can work with.");
                }
            }
            interactionEvent.interaction.lastBoxMoveEvent =
                this._fireBoxMoveEvent("drag", restrictionRect, boxRect, target.id, target);
        })
            .on('dragend', (interactionEvent) => {
            this._fireCompletedBoxMoveEvent(interactionEvent);
        })
            .on('resizestart', (interactionEvent) => {
            this._captureStartTargetRect(interactionEvent);
            log.info("resizestart: interactionEvent.rect: " + JSON.stringify(interactionEvent.rect, null, "  "));
            interactionEvent.interaction.startRect = Objects_1.Objects.duplicate(interactionEvent.rect);
        })
            .on('resizemove', (interactionEvent) => {
            log.info("resizemove: event: ", interactionEvent);
            log.info("resizemove: event.target: ", interactionEvent.target);
            log.info("resizemove: interactionEvent.interaction.startRect: " + JSON.stringify(interactionEvent.interaction.startRect, null, "  "));
            let target = interactionEvent.target;
            let restrictionRect = Rects_1.Rects.createFromBasicRect({
                left: 0,
                top: 0,
                width: restrictionElement.offsetWidth,
                height: restrictionElement.offsetHeight
            });
            let tempRect = Rects_1.Rects.createFromBasicRect(interactionEvent.rect);
            let deltaRect = Rects_1.Rects.subtract(tempRect, interactionEvent.interaction.startRect);
            let resizeRect = Rects_1.Rects.add(interactionEvent.interaction.startTargetRect, deltaRect);
            let intersectedBoxes = this._calculateIntersectedBoxes(target, resizeRect, boxOptions.intersectedElementsSelector);
            log.info("resizemove: deltaRect: " + JSON.stringify(deltaRect, null, "  "));
            let boxRect;
            if (intersectedBoxes.intersectedRects.length === 0) {
                log.info("Resizing in non-intersected mode");
                boxRect = resizeRect;
                this._resizeTargetElement(resizeRect, target);
            }
            else {
                log.info("Resizing in intersected mode");
                let resizeRectAdjacencyCalculator = new ResizeRectAdjacencyCalculator();
                let intersectedRect = intersectedBoxes.intersectedRects[0];
                let rectEdges = new RectEdges_1.RectEdges(interactionEvent.edges);
                let adjustedRect = resizeRectAdjacencyCalculator.calculate(resizeRect, intersectedRect, rectEdges);
                log.info("resizemove: adjustedRect: " + JSON.stringify(adjustedRect, null, "  "));
                boxRect = adjustedRect;
                this._resizeTargetElement(adjustedRect, target);
            }
            interactionEvent.interaction.lastBoxMoveEvent
                = this._fireBoxMoveEvent("resize", restrictionRect, boxRect, target.id, target);
        })
            .on('resizeend', (interactionEvent) => {
            this._fireCompletedBoxMoveEvent(interactionEvent);
        });
    }
    _fireBoxMoveEvent(type, restrictionRect, boxRect, id, target) {
        let boxMoveEvent = new BoxMoveEvent_1.BoxMoveEvent({
            type,
            restrictionRect,
            boxRect,
            id,
            target,
        });
        if (this.callback) {
            this.callback(boxMoveEvent);
        }
        return boxMoveEvent;
    }
    _fireCompletedBoxMoveEvent(interactionEvent) {
        if (interactionEvent.interaction.lastBoxMoveEvent) {
            let boxMoveEvent = Object.assign({}, interactionEvent.interaction.lastBoxMoveEvent);
            boxMoveEvent.state = "completed";
            if (this.callback) {
                log.info("Firing completed BoxMoveEvent: ", boxMoveEvent);
                setTimeout(() => this.callback(boxMoveEvent), 1);
            }
        }
    }
    _calculateIntersectedBoxes(element, resizeRect, intersectedElementsSelector) {
        Preconditions_1.Preconditions.assertNotNull(element, "element");
        Preconditions_1.Preconditions.assertNotNull(resizeRect, "resizeRect");
        Preconditions_1.Preconditions.assertNotNull(intersectedElementsSelector, "intersectedElementsSelector");
        log.info("_calculateIntersectedBoxes: resizeRect is: " + JSON.stringify(resizeRect, null, "  "));
        const boxes = Array.from(element.parentElement.querySelectorAll(intersectedElementsSelector))
            .filter(current => current !== element)
            .map(current => current);
        boxes.forEach(current => current.getAttribute("id") !== element.getAttribute("id"));
        let intersectedRects = [];
        boxes.forEach(box => {
            let boxRect = Rects_1.Rects.fromElementStyle(box);
            if (Rects_1.Rects.intersect(boxRect, resizeRect)) {
                intersectedRects.push(boxRect);
            }
        });
        return {
            resizeRect,
            intersectedRects
        };
    }
    _computeOriginXY(interactionEvent) {
        let delta = {
            x: interactionEvent.pageX - interactionEvent.interaction.startCoords.page.x,
            y: interactionEvent.pageY - interactionEvent.interaction.startCoords.page.y
        };
        let x = interactionEvent.interaction.startTargetRect.left + delta.x;
        let y = interactionEvent.interaction.startTargetRect.top + delta.y;
        return { x, y };
    }
    _moveTargetElement(x, y, target) {
        target.style.left = `${x}px`;
        target.style.top = `${y}px`;
        target.setAttribute('data-x', `${x}`);
        target.setAttribute('data-y', `${y}`);
    }
    _resizeTargetElement(rect, target) {
        this._moveTargetElement(rect.left, rect.top, target);
        target.style.width = `${rect.width}px`;
        target.style.height = `${rect.height}px`;
    }
    _captureStartTargetRect(interactionEvent) {
        interactionEvent.interaction.startTargetRect = Rects_1.Rects.fromElementStyle(interactionEvent.target);
    }
}
exports.BoxController = BoxController;
//# sourceMappingURL=BoxController.js.map