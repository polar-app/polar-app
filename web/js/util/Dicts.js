"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dicts = void 0;
class Dicts {
    static ownKeys(dict, callback) {
        for (const key in dict) {
            if (dict.hasOwnProperty(key)) {
                const value = dict[key];
                callback(key, value);
            }
        }
    }
}
exports.Dicts = Dicts;
//# sourceMappingURL=Dicts.js.map