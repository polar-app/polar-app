/**
 * Represents a row of highlighted text including the rect around it, and the
 * elements it contains.
 */
class TextHighlightRow {

    constructor(rect, rectElements) {
        this.rect = rect;
        this.rectElements = rectElements;
    }

};

module.exports.TextHighlightRow = TextHighlightRow;
