const {Point} = require("../../../Point");
const {Objects} = require("../../../util/Objects");
const {Rect} = require("../../../Rect");
const {Rects} = require("../../../Rects");
const {RectText} = require("./RectText");
const {TextNodes} = require("../selection/TextNodes");

class RectTexts {

    /**
     *
     * @param textNodes
     */
    static toRectTexts(textNodes) {
        return textNodes.map(RectTexts.toRectText)
                        .filter(current => current.boundingPageRect.width > 0 && current.boundingPageRect.height > 0);
    }

    /**
     * Take a Node of type TEXT and build a RectText including the the text,
     * the rects, etc.
     *
     * @param textNode {Node}
     * @return {RectText}
     */
    static toRectText(textNode) {

        let range = TextNodes.getRange(textNode);

        // FIXME: this is wrong and we are using teh wrong scroll position.

        let win = textNode.ownerDocument.defaultView;

        let scrollPoint = new Point({
            x: win.scrollX,
            y: win.scrollY
        });

        let boundingClientRect = range.getBoundingClientRect();

        let boundingPageRect = new Rect(Objects.duplicate(boundingClientRect));
        boundingPageRect = Rects.relativeTo(scrollPoint, boundingPageRect);

        return new RectText({
            clientRects: range.getClientRects(),
            boundingClientRect,
            boundingPageRect,
            text: textNode.textContent
        });

    }

}

module.exports.RectTexts = RectTexts;
