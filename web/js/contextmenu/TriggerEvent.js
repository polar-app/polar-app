class TriggerEvent {

    constructor(opts) {

        /**
         * The point on the screen where the context menu was requested.  This
         * is just a point with x,y positions.
         *
         * @type {null}
         */
        this.point = null;

        /**
         * The type of context menus to create based on what the user is clicking.
         * @type {Object}
         */
        this.contextMenuTypes = null;

        /**
         * A more complex data structure with the selectors and metadata
         * about the annotations that were selected.
         * @type {Object}
         */
        this.matchingSelectors = null;

        /**
         * Basic metadata about the document with which we're interacting.
         *
         * @type {DocDescriptor}
         */
        this.docDescriptor = null;

        Object.assign(this, opts);

    }

}

module.exports.TriggerEvent = TriggerEvent;
