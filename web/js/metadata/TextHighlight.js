"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHighlight = void 0;
const Texts_1 = require("polar-shared/src/metadata/Texts");
const TextType_1 = require("polar-shared/src/metadata/TextType");
const BaseHighlight_1 = require("./BaseHighlight");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class TextHighlight extends BaseHighlight_1.BaseHighlight {
    constructor(val) {
        super(val);
        this.textSelections = {};
        this.text = Texts_1.Texts.create("", TextType_1.TextType.HTML);
        this.init(val);
    }
    validate() {
        super.validate();
        Preconditions_1.Preconditions.assertNotInstanceOf(this.textSelections, "textSelections", Array);
    }
}
exports.TextHighlight = TextHighlight;
//# sourceMappingURL=TextHighlight.js.map