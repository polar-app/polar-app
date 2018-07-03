const {TextRect} = require("../../../metadata/TextRect");

class TextSelections {

    static compute(selectedContents) {

        let result = [

        ];

        // TODO: could be cleaner as a map...

        selectedContents.rectTexts.forEach(function (rectText) {
            let textSelection = new TextRect({
                rect: rectText.boundingPageRect,
                text: rectText.text
            });

            result.push(textSelection);

        });

        return result;

    }

}

module.exports.TextSelections = TextSelections;
