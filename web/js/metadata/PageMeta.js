"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageMeta = void 0;
const SerializedObject_1 = require("./SerializedObject");
class PageMeta extends SerializedObject_1.SerializedObject {
    constructor(val) {
        super(val);
        this.pagemarks = {};
        this.notes = {};
        this.comments = {};
        this.questions = {};
        this.flashcards = {};
        this.textHighlights = {};
        this.areaHighlights = {};
        this.screenshots = {};
        this.thumbnails = {};
        this.readingProgress = {};
        this.pageInfo = val.pageInfo;
        this.init(val);
    }
    setup() {
        super.setup();
        if (!this.pagemarks) {
            this.pagemarks = {};
        }
        if (!this.textHighlights) {
            this.textHighlights = {};
        }
        if (!this.areaHighlights) {
            this.areaHighlights = {};
        }
        if (!this.screenshots) {
            this.screenshots = {};
        }
        if (!this.thumbnails) {
            this.thumbnails = {};
        }
    }
    validate() {
        super.validate();
    }
}
exports.PageMeta = PageMeta;
//# sourceMappingURL=PageMeta.js.map