"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutator = void 0;
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
class Mutator {
    static mutate(value, mutateFunction) {
        const copyOf = Dictionaries_1.Dictionaries.copyOf(value);
        return Object.freeze(mutateFunction(copyOf));
    }
}
exports.Mutator = Mutator;
//# sourceMappingURL=Mutator.js.map