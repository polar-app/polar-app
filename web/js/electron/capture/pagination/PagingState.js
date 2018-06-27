class PagingState {

    /**
     *
     * @param scrollPosition {Point}
     * @param scrollBox {BasicBox}
     * @param viewportBox {BasicBox}
     */
    constructor(scrollPosition, scrollBox, viewportBox) {
        this.scrollPosition = scrollPosition;
        this.scrollBox = scrollBox;
        this.viewportBox = viewportBox;
    }

}

module.exports.PaginationBox = PagingState;
