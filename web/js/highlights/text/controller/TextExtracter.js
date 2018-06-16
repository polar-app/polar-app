const $ = require('jquery');

/**
 * Takes TextHighlightRows and then builds adjacent test runs from the data.
 */
class TextExtracter {

    static toTextSelections(textHighlightRows) {

        let result = [

        ];

        textHighlightRows.forEach(function (textHighlightRow) {

            textHighlightRow.rectElements.forEach(function(rectElement) {

                let textSelection = {
                    rect: rectElement.rect,
                    text: $(rectElement.element).text()
                };

                result.push(textSelection);

            });

        });

        return result;

    }

}

module.exports.TextExtracter = TextExtracter;
