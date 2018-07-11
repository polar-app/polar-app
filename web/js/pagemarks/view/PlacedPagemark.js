class PlacedPagemark {

    constructor(opts) {

        /**
         * The place on the page to place this pagemark.
         *
         * @type {Rect}
         */
        this.rect = undefined;

        Object.assign(this, opts);

    }

}

module.exports.PlacedPagemark = PlacedPagemark;
