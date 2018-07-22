class BoxOptions {

    constructor(opts) {

        /**
         * The element or selector to define boxes.
         *
         * @type {HTMLElement}
         */
        this.target = undefined;

        /**
         * The element used to define the restrictionRect.
         *
         * @type {HTMLElement}
         */
        this.restrictionElement = undefined;

        /**
         * Specify the CSS selector for intersected elements.
         *
         * @type {undefined}
         */
        this.intersectedElementsSelector = undefined;

        Object.assign(this, opts);

    }

}

module.exports.BoxOptions = BoxOptions;
