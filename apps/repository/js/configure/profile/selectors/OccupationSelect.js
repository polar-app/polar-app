"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupationSelect = void 0;
const Occupations_1 = require("polar-shared/src/util/Occupations");
function toOption(occupation) {
    return {
        value: occupation,
        label: occupation.name
    };
}
const academicOptions = Occupations_1.academicOccupations.map(Occupations_1.Occupations.academicFromName)
    .map(toOption);
const businessOptions = Occupations_1.businessOccupations.map(Occupations_1.Occupations.businessFromName)
    .map(toOption);
const options = [...academicOptions, ...businessOptions];
exports.OccupationSelect = (props) => {
    const onSelect = (option) => {
        if (option === null) {
            props.onSelect(undefined);
        }
        else if (typeof option === 'string') {
            props.onSelect(toOption(Occupations_1.Occupations.businessFromName(option)));
        }
        else {
            props.onSelect(option);
        }
    };
    return null;
};
//# sourceMappingURL=OccupationSelect.js.map