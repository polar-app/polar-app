"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelNames = void 0;
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
class ModelNames {
    static verifyRequired(modelNames) {
        const requiredModelNames = ["Cloze", "Basic"];
        return SetArrays_1.SetArrays.difference(requiredModelNames, modelNames);
    }
}
exports.ModelNames = ModelNames;
//# sourceMappingURL=ModelNames.js.map