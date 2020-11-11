"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokens = void 0;
class Tokens {
    static hyphenToCamelCase(key) {
        key = key.replace(/-([a-zA-Z])/g, (match) => {
            return match.replace("-", "").toUpperCase();
        });
        return key;
    }
}
exports.Tokens = Tokens;
//# sourceMappingURL=Tokens.js.map