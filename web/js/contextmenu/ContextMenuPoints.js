class ContextMenuPoints {

    constructor(opts) {

        /**
         *
         * @type {Point}
         */
        this.page = undefined;

        /**
         *
         * @type {Point}
         */
        this.client = undefined;

        /**
         *
         * @type {Point}
         */
        this.offset = undefined;

        /**
         *
         * @type {Point}
         */
        this.pageOffset = undefined;

        Object.assign(this, opts);

    }

}

module.exports.ContextMenuPoints = ContextMenuPoints;
