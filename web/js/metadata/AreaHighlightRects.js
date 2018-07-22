const {AreaHighlightRect} = require("./AreaHighlightRect")

class AreaHighlightRects {
    /**
     *
     *
     * @param rect {Rect}
     * @return {AreaHighlightRect}
     */
    static createFromRect(rect) {

        return new AreaHighlightRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });

    }

}

module.exports.AreaHighlightRects = AreaHighlightRects;