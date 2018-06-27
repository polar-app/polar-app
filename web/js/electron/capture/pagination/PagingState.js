class PagingState {

    constructor(obj) {

        /**
         * @type {Point}
         */
        this.scrollPosition = null;

        /**
         * @type {BasicBox}
         */
        this.scrollBox = null;

        /**
         * @type {BasicBox}
         */
        this.viewportBox = null;

        Object.assign(this, obj);

    }

    /**
     *
     * @param scrollPosition {Point}
     * @param scrollBox {BasicBox}
     * @param viewportBox {BasicBox}
     */
    static create(scrollPosition, scrollBox, viewportBox) {
        this.scrollPosition = scrollPosition;
        this.scrollBox = scrollBox;
        this.viewportBox = viewportBox;
    }

}

module.exports.PagingState = PagingState;
