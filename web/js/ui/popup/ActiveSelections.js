"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveSelections = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const Selections_1 = require("../../highlights/text/selection/Selections");
const Ranges_1 = require("../../highlights/text/selection/Ranges");
const log = Logger_1.Logger.create();
class ActiveSelections {
    static addEventListener(listener, target = document.body) {
        let originPoint;
        let activeSelection;
        let eventFired = 'none';
        const handleDestroyedSelection = () => {
            listener(Object.assign(Object.assign({}, activeSelection), { type: 'destroyed' }));
            activeSelection = undefined;
            eventFired = 'destroyed';
        };
        const onMouseUp = (event, element) => {
            const handleMouseEvent = () => {
                let hasActiveTextSelection = false;
                eventFired = 'none';
                try {
                    const view = event.view || window;
                    const selection = view.getSelection();
                    hasActiveTextSelection = this.hasActiveTextSelection(selection);
                    const point = this.eventToPoint(event);
                    if (!element) {
                        log.warn("No target element: ", event.target);
                        return;
                    }
                    if (activeSelection) {
                        handleDestroyedSelection();
                    }
                    if (hasActiveTextSelection) {
                        const mouseDirection = point.y - originPoint.y < 0 ? 'up' : 'down';
                        const range = selection.getRangeAt(0);
                        const boundingClientRect = range.getBoundingClientRect();
                        activeSelection = {
                            element,
                            originPoint: originPoint,
                            mouseDirection,
                            boundingClientRect,
                            selection,
                            view,
                            type: 'created'
                        };
                        listener(activeSelection);
                        eventFired = 'created';
                    }
                }
                finally {
                }
            };
            this.withTimeout(() => handleMouseEvent());
        };
        const onMouseDown = (event, type) => {
            if (event.ctrlKey || event.metaKey) {
                return;
            }
            if (!activeSelection) {
                originPoint = this.eventToPoint(event);
            }
            const element = this.targetElementForEvent(event);
            const view = event.view || window;
            switch (type) {
                case "mouse":
                    view.addEventListener('mouseup', event => {
                        onMouseUp(event, element);
                    }, { once: true });
                    break;
                case "touch":
                    view.addEventListener('touchend', event => {
                        onMouseUp(event, element);
                    }, { once: true });
                    break;
            }
        };
        const onKeyPress = (event) => {
            if (event.key === 'Escape') {
                handleDestroyedSelection();
            }
        };
        target.addEventListener('mousedown', (event) => {
            onMouseDown(event, 'mouse');
        });
        target.addEventListener('touchstart', (event) => {
            onMouseDown(event, 'touch');
        });
    }
    static withTimeout(callback) {
        setTimeout(() => callback(), 1);
    }
    static targetElementForEvent(event) {
        const anyTarget = event.target;
        if (anyTarget.nodeType === Node.ELEMENT_NODE) {
            return event.target;
        }
        else {
            return event.target.parentElement;
        }
    }
    static hasActiveTextSelection(selection) {
        const ranges = Selections_1.Selections.toRanges(selection);
        for (const range of ranges) {
            if (Ranges_1.Ranges.hasText(range)) {
                return true;
            }
        }
        return false;
    }
    static eventToPoint(event) {
        if ('offsetX' in event) {
            return {
                x: event.offsetX,
                y: event.offsetY
            };
        }
        if (!event.target) {
            throw new Error("No target");
        }
        if (event.changedTouches.length === 0) {
            log.warn("No touches found in event: ", event);
            throw new Error("No touches");
        }
        const rect = event.target.getBoundingClientRect();
        const x = event.changedTouches[0].pageX - rect.left;
        const y = event.changedTouches[0].pageY - rect.top;
        return { x, y };
    }
}
exports.ActiveSelections = ActiveSelections;
//# sourceMappingURL=ActiveSelections.js.map