"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectedContents = void 0;
const Ranges_1 = require("./Ranges");
const Selections_1 = require("./Selections");
const RectTexts_1 = require("../controller/RectTexts");
const HTMLSanitizer_1 = require("polar-html/src/sanitize/HTMLSanitizer");
const TextNodeRows_1 = require("./TextNodeRows");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Strings_1 = require("polar-shared/src/util/Strings");
var SelectedContents;
(function (SelectedContents) {
    function computeFromWindow(win, opts) {
        const selection = win.getSelection();
        return computeFromSelection(selection, opts);
    }
    SelectedContents.computeFromWindow = computeFromWindow;
    function computeFromSelection(selection, opts) {
        const ranges = Ranges_1.Ranges.cloneRanges(Selections_1.Selections.toRanges(selection));
        const html = HTMLSanitizer_1.HTMLSanitizer.sanitize(toHTML(ranges));
        function computeRectTexts() {
            const textNodes = ArrayStreams_1.arrayStream(ranges)
                .map(Ranges_1.Ranges.getTextNodes)
                .flatMap(current => current)
                .collect();
            const textNodesRows = TextNodeRows_1.TextNodeRows.fromTextNodes(textNodes);
            return RectTexts_1.RectTexts.toRectTexts(textNodesRows);
        }
        function computeOrder() {
            var _a, _b, _c, _d;
            if (opts.fileType === 'pdf') {
                return undefined;
            }
            if (ranges.length === 0) {
                return 0;
            }
            const scrollY = (_d = (_c = (_b = (_a = ranges[0].startContainer) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.ownerDocument) === null || _c === void 0 ? void 0 : _c.defaultView) === null || _d === void 0 ? void 0 : _d.scrollY;
            return ranges[0].getBoundingClientRect().top + (scrollY || 0);
        }
        const rectTexts = opts.noRectTexts === true ? [] : computeRectTexts();
        function computeText() {
            if (rectTexts.length > 0) {
                return Strings_1.Strings.joinWithSpacing(rectTexts.map(current => current.text));
            }
            return toText(ranges);
        }
        const text = computeText();
        const order = computeOrder();
        return {
            text,
            html,
            rectTexts,
            order
        };
    }
    SelectedContents.computeFromSelection = computeFromSelection;
    function toHTML(ranges) {
        return ranges.map(range => Ranges_1.Ranges.toHTML(range)).join("");
    }
    SelectedContents.toHTML = toHTML;
    function toText(ranges) {
        return ranges.map(range => Ranges_1.Ranges.toText(range)).join("");
    }
    SelectedContents.toText = toText;
})(SelectedContents = exports.SelectedContents || (exports.SelectedContents = {}));
//# sourceMappingURL=SelectedContents.js.map