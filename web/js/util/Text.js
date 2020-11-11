"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
class Text {
    static indent(text, prefix) {
        const result = prefix + text;
        return result.replace(/\n/g, `\n${prefix}`);
    }
    static isWhitespace(text) {
        return /^\s+$/.test(text);
    }
    static createDuplicateText(ch, len) {
        if (ch.length !== 1) {
            throw new Error("The ch char must be 1 char");
        }
        const arr = new Array(len);
        arr.fill(ch);
        return arr.join("");
    }
}
exports.Text = Text;
//# sourceMappingURL=Text.js.map