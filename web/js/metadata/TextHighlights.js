const {TextHighlightRecords} = require("./TextHighlightRecords");

class TextHighlights {

    /**
     * Create a mock text highlight for testing.
     * @return {*}
     */
    static createMockTextHighlight() {

        let rects = [ {top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}];
        let textSelections = ["hello world"];
        let text = "hello world";

        // create a basic TextHighlight object..
        return TextHighlightRecords.create(rects, textSelections, text).value;

    }


}

module.exports.TextHighlights = TextHighlights;
