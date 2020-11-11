"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageMetas = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const Functions_1 = require("polar-shared/src/util/Functions");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const Pagemarks_1 = require("./Pagemarks");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const log = Logger_1.Logger.create();
class PageMetas {
    static upgrade(pageMetas) {
        pageMetas = Object.assign({}, pageMetas);
        Functions_1.forDict(pageMetas, (key, pageMeta) => {
            if (!Preconditions_1.isPresent(pageMeta.textHighlights)) {
                pageMeta.textHighlights = {};
            }
            Functions_1.forDict(pageMeta.textHighlights, (_, textHighlight) => {
                if (!textHighlight.id) {
                    textHighlight.id = Hashcodes_1.Hashcodes.createID(textHighlight.rects);
                }
            });
            if (!Preconditions_1.isPresent(pageMeta.areaHighlights)) {
                pageMeta.areaHighlights = {};
            }
            if (!pageMeta.pagemarks) {
                pageMeta.pagemarks = {};
            }
            if (!pageMeta.screenshots) {
                pageMeta.screenshots = {};
            }
            if (!pageMeta.notes) {
                pageMeta.notes = {};
            }
            if (!pageMeta.comments) {
                pageMeta.comments = {};
            }
            if (!pageMeta.questions) {
                pageMeta.questions = {};
            }
            if (!pageMeta.readingProgress) {
                pageMeta.readingProgress = {};
            }
            pageMeta.pagemarks = Pagemarks_1.Pagemarks.upgrade(pageMeta.pagemarks);
        });
        return pageMetas;
    }
}
exports.PageMetas = PageMetas;
//# sourceMappingURL=PageMetas.js.map