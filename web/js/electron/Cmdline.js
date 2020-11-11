"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cmdline = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
class Cmdline {
    static getDocArg(args) {
        return Cmdline.getArg(args, Cmdline.isDoc);
    }
    static getURLArg(args) {
        return Cmdline.getArg(args, Cmdline.isURL);
    }
    static getArg(args, filter) {
        Preconditions_1.Preconditions.assertNotNull(filter, "filter");
        if (!(args instanceof Array)) {
            throw new Error("Args not an array");
        }
        const arg = args.filter((arg) => arg != null && filter(arg))
            .reduce((accumulator, currentValue) => accumulator = currentValue != null ? currentValue : null, null);
        return arg;
    }
    static isDoc(arg) {
        return FilePaths_1.FilePaths.hasExtension(arg, "pdf") || FilePaths_1.FilePaths.hasExtension(arg, "chtml") || FilePaths_1.FilePaths.hasExtension(arg, "phz");
    }
    static isURL(arg) {
        return arg.startsWith("http:") || arg.startsWith("https:") || arg.startsWith("file:");
    }
}
exports.Cmdline = Cmdline;
//# sourceMappingURL=Cmdline.js.map