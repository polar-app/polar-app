"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectPathEntry_1 = require("./ObjectPathEntry");
const Paths_1 = require("../util/Paths");
class ObjectPaths {
    static recurse(obj) {
        let result = [];
        ObjectPaths._recurse("/", obj, null, null, result);
        result.sort(function (val0, val1) {
            return val0.path.localeCompare(val1.path);
        });
        return result;
    }
    static _recurse(path, obj, parent, parentKey, result) {
        if (typeof obj !== "object") {
            throw new Error("We can only recurse on object types.");
        }
        result.push(new ObjectPathEntry_1.ObjectPathEntry(path, obj, parent, parentKey));
        for (let childKey in obj) {
            if (obj.hasOwnProperty(childKey)) {
                let childVal = obj[childKey];
                if (childVal && typeof childVal === "object") {
                    let childPath = Paths_1.Paths.create(path, childKey);
                    ObjectPaths._recurse(childPath, childVal, obj, childKey, result);
                }
            }
        }
    }
}
exports.ObjectPaths = ObjectPaths;
//# sourceMappingURL=ObjectPaths.js.map