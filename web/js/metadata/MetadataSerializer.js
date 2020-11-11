"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataSerializer = void 0;
const SerializedObject_1 = require("./SerializedObject");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class MetadataSerializer {
    static serialize(object, spacing = "") {
        return JSON.stringify(object, null, spacing);
    }
    static deserialize(obj, data) {
        Preconditions_1.Preconditions.assertPresent(data, 'data');
        if (!(typeof data === "string")) {
            throw new Error("We can only deserialize strings: " + typeof data);
        }
        const parsed = JSON.parse(data);
        Object.assign(obj, parsed);
        return obj;
    }
    static replacer(key, value) {
        if (value instanceof SerializedObject_1.SerializedObject) {
            value.setup();
            value.validate();
        }
        return value;
    }
    static reviver(key, value) {
        if (value instanceof SerializedObject_1.SerializedObject) {
            value.setup();
            value.validate();
        }
        return value;
    }
}
exports.MetadataSerializer = MetadataSerializer;
//# sourceMappingURL=MetadataSerializer.js.map