"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHighlighter = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const TextSelections_1 = require("../../../../web/js/highlights/text/controller/TextSelections");
const DocMetas_1 = require("../../../../web/js/metadata/DocMetas");
const TextHighlightRecords_1 = require("../../../../web/js/metadata/TextHighlightRecords");
const Rects_1 = require("../../../../web/js/Rects");
const AreaHighlights_1 = require("../../../../web/js/metadata/AreaHighlights");
const log = Logger_1.Logger.create();
var TextHighlighter;
(function (TextHighlighter) {
    function getInnerClientRect(element) {
        const boundingClientRect = element.getBoundingClientRect();
        const styling = getComputedStyle(element, null);
        const topBorder = parseInt(styling.getPropertyValue('border-top-width'));
        const rightBorder = parseInt(styling.getPropertyValue('border-right-width'));
        const bottomBorder = parseInt(styling.getPropertyValue('border-bottom-width'));
        const leftBorder = parseInt(styling.getPropertyValue('border-left-width'));
        return {
            left: boundingClientRect.left + leftBorder,
            top: boundingClientRect.top + topBorder,
            width: boundingClientRect.width - leftBorder - rightBorder,
            height: boundingClientRect.height - topBorder - bottomBorder,
        };
    }
    function computeRectWithinPageElement(pageElement, clientRect) {
        const pageElementBCR = getInnerClientRect(pageElement);
        return {
            left: clientRect.left - pageElementBCR.left,
            top: clientRect.top - pageElementBCR.top,
            width: clientRect.width,
            height: clientRect.height
        };
    }
    function createTextHighlight(opts) {
        const { highlightColor, docMeta, pageNum, pageElement, selectedContent, docScale } = opts;
        log.info("createTextHighlight");
        const { rectTexts } = selectedContent;
        const rects = rectTexts.map(current => computeRectWithinPageElement(pageElement, current.boundingClientRect))
            .map(Rects_1.Rects.createFromBasicRect)
            .map(current => AreaHighlights_1.AreaHighlights.toCorrectScale2(current, docScale.scaleValue))
            .map(Rects_1.Rects.createFromBasicRect);
        const textSelections = TextSelections_1.TextSelections.compute(selectedContent);
        const { text, order } = selectedContent;
        const textHighlightRecord = TextHighlightRecords_1.TextHighlightRecords.create(rects, textSelections, { TEXT: text }, highlightColor, order);
        log.info("Added text highlight to model");
        const textHighlight = textHighlightRecord.value;
        const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageNum);
        return { docMeta, pageMeta, textHighlight };
    }
    TextHighlighter.createTextHighlight = createTextHighlight;
})(TextHighlighter = exports.TextHighlighter || (exports.TextHighlighter = {}));
//# sourceMappingURL=TextHighlighter.js.map