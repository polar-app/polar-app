"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Strings_1 = require("./Strings");
class ArgsParser {
    static _toKey(key) {
        key = key.replace(/^--/, "");
        key = key.replace(/-([a-zA-Z])/g, (match) => {
            return match.replace("-", "").toUpperCase();
        });
        return key;
    }
    static parse(argv) {
        let result = {};
        argv.forEach((arg) => {
            if (/^--[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+/.test(arg)) {
                let _split = arg.split("=");
                let key = ArgsParser._toKey(_split[0]);
                let value = Strings_1.Strings.toPrimitive(_split[1]);
                result[key] = value;
            }
        });
        return result;
    }
}
exports.ArgsParser = ArgsParser;
//# sourceMappingURL=ArgsParser.js.map