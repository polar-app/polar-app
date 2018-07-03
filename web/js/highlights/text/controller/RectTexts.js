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

        return new RectText({
            clientRects: range.getClientRects(),
            boundingClientRect: range.getBoundingClientRect(),
            text: textNode.textContent
        });

    }

}

module.exports.RectTexts = RectTexts;
