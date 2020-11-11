"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalize = void 0;
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
function canonicalize(obj) {
    delete obj.uuid;
    const result = Dictionaries_1.Dictionaries.sorted(obj);
    return result;
}
exports.canonicalize = canonicalize;
//# sourceMappingURL=testing.js.map