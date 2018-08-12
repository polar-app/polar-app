"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Texts_1 = require("./Texts");
const TextType_1 = require("./TextType");
const BaseHighlight_1 = require("./BaseHighlight");
const Preconditions_1 = require("../Preconditions");
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
    ;
}
exports.TextHighlight = TextHighlight;
//# sourceMappingURL=TextHighlight.js.map