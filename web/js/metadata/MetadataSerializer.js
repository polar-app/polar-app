"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerializedObject_1 = require("./SerializedObject");
class MetadataSerializer {
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
    static serialize(object, spacing = "") {
        return JSON.stringify(object, null, spacing);
    }
    static deserialize(obj, data) {
        if (!data) {
            throw new Error("No data given!");
        }
        if (!(typeof data === "string")) {
            throw new Error("We can only deserialize strings: " + typeof data);
        }
        let parsed = JSON.parse(data);
        Object.assign(obj, parsed);
        return obj;
    }
}
exports.MetadataSerializer = MetadataSerializer;
//# sourceMappingURL=MetadataSerializer.js.map