/**
 *
 */
const {Ranges} = require("./Ranges");
const {RectText} = require("../controller/RectText");
const {Point} = require("../../../Point");
const {Rect} = require("../controller/Rect");
const {Rects} = require("../../../Rects");
const {Objects} = require("../../../util/Objects");
const {SelectedContent} = require("./SelectedContent");

class Selections {

    /**
     * Get the ranges of a selection as an array (easier API).
     *
     * @param selection {Selection}
     * @return {Array<Range>}
     */
    static toRanges(selection) {

        let result = [];

        for (let idx = 0; idx < selection.rangeCount; idx++) {

            // note that we almost always have 1 selection
            let range = selection.getRangeAt(idx);
            result.push(range);

        }

        return result;
    }

}

module.exports.Selections = Selections;

