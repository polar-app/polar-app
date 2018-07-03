const {Point} = require("../../../Point");
const {Objects} = require("../../../util/Objects");
const {Rect} = require("../controller/Rect");
const {Rects} = require("../../../Rects");
const {RectText} = require("./RectText");
const {TextNodes} = require("../selection/TextNodes");

class RectTexts {

    /**
     *
     * @param textNodes
     */
    static toRectTexts(textNodes) {
        return textNodes.map(RectTexts.toRectText);
    }

    static toRectText(textNode) {

        let range = TextNodes.getRange(textNode);

        let scrollPoint = new Point({
            x: window.scrollX,
            y: window.scrollY
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
