"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationLevelSelect = void 0;
const EducationLevels_1 = require("polar-shared/src/util/EducationLevels");
function toOption(educationLevel) {
    return {
        value: educationLevel,
        label: educationLevel.name
    };
}
const options = EducationLevels_1.educationLevels.map(toOption);
exports.EducationLevelSelect = (props) => {
    return null;
};
//# sourceMappingURL=EducationLevelSelect.js.map