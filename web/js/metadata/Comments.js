"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comments = void 0;
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Comment_1 = require("./Comment");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const TextType_1 = require("polar-shared/src/metadata/TextType");
const Texts_1 = require("polar-shared/src/metadata/Texts");
class Comments {
    static createID() {
        const seq = this.SEQUENCE++;
        const now = Date.now();
        return Hashcodes_1.Hashcodes.createID({ seq, now }, 20);
    }
    static createTextComment(text, ref) {
        const content = Texts_1.Texts.create(text, TextType_1.TextType.TEXT);
        const id = this.createID();
        const created = ISODateTimeStrings_1.ISODateTimeStrings.create();
        const lastUpdated = created;
        return new Comment_1.Comment({ content, id, guid: id, created, lastUpdated, ref });
    }
    static createHTMLComment(text, ref, created, lastUpdated) {
        const content = Texts_1.Texts.create(text, TextType_1.TextType.HTML);
        const id = this.createID();
        if (!created) {
            created = ISODateTimeStrings_1.ISODateTimeStrings.create();
        }
        if (!lastUpdated) {
            lastUpdated = created;
        }
        return new Comment_1.Comment({ content, id, guid: id, created, lastUpdated, ref });
    }
}
exports.Comments = Comments;
Comments.SEQUENCE = 0;
//# sourceMappingURL=Comments.js.map