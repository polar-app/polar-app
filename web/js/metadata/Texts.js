"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Text_1 = require("./Text");
class Texts {
    static create(body, type) {
        let text = new Text_1.Text();
        text[type] = body;
        return Object.freeze(text);
    }
}
exports.Texts = Texts;
//# sourceMappingURL=Texts.js.map