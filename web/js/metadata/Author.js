"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = void 0;
const SerializedObject_1 = require("./SerializedObject");
class Author extends SerializedObject_1.SerializedObject {
    constructor(val) {
        super(val);
        this.name = "";
        this.name = val.name;
        this.profileID = val.profileID;
        this.url = val.url;
        this.image = val.image;
        this.guest = val.guest;
    }
}
exports.Author = Author;
//# sourceMappingURL=Author.js.map