"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Paths {
    static create(dirname, basename) {
        if (!dirname)
            throw new Error("Dirname required");
        if (!basename)
            throw new Error("Basename required");
        if (dirname.indexOf("//") !== -1 || basename.indexOf("//") !== -1) {
            throw new Error("No // in dirname");
        }
        let result = dirname + "/" + basename;
        result = result.replace(/\/\/+/g, "/");
        result = result.replace(/\/$/g, "");
        return result;
    }
    static basename(data) {
        let end = data.lastIndexOf("/");
        if (end <= -1) {
            return null;
        }
        return data.substring(end + 1, data.length);
    }
}
exports.Paths = Paths;
//# sourceMappingURL=Paths.js.map