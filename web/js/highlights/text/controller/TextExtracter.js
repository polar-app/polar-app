const $ = require('jquery');
const {Preconditions} = require("../../../Preconditions");
const {TextRect} = require("../../../metadata/TextRect");

/**
 * Takes TextHighlightRows and then builds adjacent test runs from the data.
 */
class TextExtracter {

    static toTextSelections(textHighlightRows) {

        let result = [

        ];

        textHighlightRows.forEach(function (textHighlightRow) {

            Preconditions.assertNotNull(textHighlightRow.rectElements, "rectElements");

            textHighlightRow.rectElements.forEach(function(rectElement) {

                let textSelection = new TextRect({
                    rect: rectElement.rect,
                    text: $(rectElement.element).text()
                });

                result.push(textSelection);

            });

        });

        return result;

    }

}

module.exports.TextExtracter = TextExtracter;
