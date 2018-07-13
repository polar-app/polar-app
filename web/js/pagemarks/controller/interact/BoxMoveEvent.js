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
         * The Rect of the box we moved.
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

        Object.assign(this, opts);

    }

}

module.exports.BoxMoveEvent = BoxMoveEvent;
