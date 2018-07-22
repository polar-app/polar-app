const {Preconditions} = require("../../Preconditions");
const {Rect} = require("../../Rect");

class BoxMoveEvent {

    constructor(opts) {

        /**
         * The type of the event.  Either 'resize' or 'drag'
         * @type {string}
         */
        this.type = undefined;

        /**
         * The restrictionRect Rect of the box we moved.  This is the parent
         * Rect.
         *
         * @type {Rect}
         */
        this.restrictionRect = undefined;

        /**
         * The Rect of the box we moved.  This is the final position of the box
         * once we're done moving it.
         *
         * @type {Rect}
         */
        this.boxRect = undefined;

        /**
         * The ID of the box we moved.
         *
         * @type {string}
         */
        this.id = undefined;

        /**
         * The element being moved.
         *
         * @type {HTMLElement}
         */
        this.target = undefined;

        /**
         * The state of the box movement. States are:
         *
         * pending: The box is still being drawn but the user hasn't finished
         * moving it:
         *
         * completed: The box move operation is completed and is in its final position.
         *
         * @type {string}
         */
        this.state = "pending";

        Object.assign(this, opts);

        Preconditions.assertInstanceOf(this.boxRect, Rect, "boxRect");

    }

}

module.exports.BoxMoveEvent = BoxMoveEvent;
