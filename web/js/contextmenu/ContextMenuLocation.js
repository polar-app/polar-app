class ContextMenuLocation {

    constructor(opts) {

        /**
         * The page point where this was defined.
         *
         * @deprecated
         * @type {Point}
         */
        this.point = undefined;

        /**
         *
         * @type {ContextMenuPoints}
         */
        this.points = undefined;

        /**
         *
         * @type {number} The page number this event occurred on.
         */
        this.pageNum = undefined;

        Object.assign(this, opts);

    }

}

module.exports.ContextMenuLocation = ContextMenuLocation;
