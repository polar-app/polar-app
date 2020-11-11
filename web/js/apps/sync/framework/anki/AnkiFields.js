"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnkiFields = void 0;
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
class AnkiFields {
    static normalize(fields) {
        const result = {};
        Dictionaries_1.Dictionaries.forDict(fields, (key, value) => {
            key = key.charAt(0).toUpperCase() + key.substr(1);
            result[key] = value;
        });
        return result;
    }
}
exports.AnkiFields = AnkiFields;
//# sourceMappingURL=AnkiFields.js.map