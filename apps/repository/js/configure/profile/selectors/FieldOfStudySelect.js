"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldOfStudySelect = void 0;
const FieldOfStudies_1 = require("polar-shared/src/util/FieldOfStudies");
function toOption(fieldOfStudy) {
    return {
        value: fieldOfStudy,
        label: fieldOfStudy.name
    };
}
const options = FieldOfStudies_1.fieldsOfStudy.map(FieldOfStudies_1.toFieldOfStudy)
    .map(toOption);
exports.FieldOfStudySelect = (props) => {
    const onSelect = (option) => {
        if (option === null) {
            props.onSelect(undefined);
        }
        else if (typeof option === 'string') {
            props.onSelect(toOption(FieldOfStudies_1.toFieldOfStudy(option)));
        }
        else {
            props.onSelect(option);
        }
    };
    return null;
};
//# sourceMappingURL=FieldOfStudySelect.js.map