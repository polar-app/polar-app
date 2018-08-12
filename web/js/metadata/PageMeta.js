"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerializedObject_1 = require("./SerializedObject");
const PageInfo_1 = require("./PageInfo");
const Preconditions_1 = require("../Preconditions");
class PageMeta extends SerializedObject_1.SerializedObject {
    constructor(val) {
        super(val);
        this.pagemarks = {};
        this.notes = {};
        this.questions = {};
        this.flashcards = {};
        this.textHighlights = {};
        this.areaHighlights = {};
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
    }
    validate() {
        super.validate();
        Preconditions_1.Preconditions.assertInstanceOf(this.pageInfo, PageInfo_1.PageInfo, "pageInfo");
    }
}
exports.PageMeta = PageMeta;
//# sourceMappingURL=PageMeta.js.map