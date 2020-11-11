"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attributes = void 0;
const Tokens_1 = require("./Tokens");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Strings_1 = require("polar-shared/src/util/Strings");
class Attributes {
    static dataToMap(element) {
        return Attributes.dataToPrimitiveMap(element);
    }
    static dataToPrimitiveMap(element) {
        let result = {};
        Preconditions_1.Preconditions.assertNotNull(element, "element");
        Array.from(element.attributes).forEach((attr) => {
            if (attr.name.startsWith("data-")) {
                let key = attr.name;
                key = key.replace("data-", "");
                key = Tokens_1.Tokens.hyphenToCamelCase(key);
                result[key] = Strings_1.Strings.toPrimitive(attr.value);
            }
        });
        return result;
    }
    static dataToStringMap(element) {
        let result = {};
        Preconditions_1.Preconditions.assertNotNull(element, "element");
        Array.from(element.attributes).forEach((attr) => {
            if (attr.name.startsWith("data-")) {
                let key = attr.name;
                key = key.replace("data-", "");
                key = Tokens_1.Tokens.hyphenToCamelCase(key);
                result[key] = attr.value;
            }
        });
        return result;
    }
}
exports.Attributes = Attributes;
//# sourceMappingURL=Attributes.js.map