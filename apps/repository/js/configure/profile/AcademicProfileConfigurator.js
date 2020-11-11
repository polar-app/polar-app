"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicProfileConfigurator = void 0;
const React = __importStar(require("react"));
const EducationLevelSelect_1 = require("./selectors/EducationLevelSelect");
const FieldOfStudySelect_1 = require("./selectors/FieldOfStudySelect");
const NullCollapse_1 = require("../../../../../web/js/ui/null_collapse/NullCollapse");
const Nullable_1 = require("polar-shared/src/util/Nullable");
const UniversitySelect_1 = require("./selectors/UniversitySelect");
const Percentages_1 = require("polar-shared/src/util/Percentages");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
exports.AcademicProfileConfigurator = (props) => {
    const onForm = (newProfile) => {
        const occupation = props.occupation;
        const profile = Object.assign(Object.assign({ occupation }, props.form.profile), newProfile);
        const computeProgress = () => {
            const tasks = [
                props.occupation,
                profile.educationLevel,
                profile.fieldOfStudy,
                profile.university
            ];
            const score = ArrayStreams_1.arrayStream(tasks)
                .filter(current => current !== undefined)
                .collect()
                .length;
            return Percentages_1.Percentages.calculate(score, tasks.length);
        };
        const progress = computeProgress();
        props.onForm(Object.assign(Object.assign({}, props.form), { profile,
            progress }));
    };
    return (React.createElement("div", null,
        React.createElement(NullCollapse_1.NullCollapse, { open: props.occupation !== undefined },
            React.createElement("div", { className: "mb-1 mt-2" },
                React.createElement("div", { className: "mb-1 font-weight-bold" }, "At what level of education?"),
                React.createElement("div", { className: "mt-1" },
                    React.createElement(EducationLevelSelect_1.EducationLevelSelect, { placeholder: "Bachelors, Masters, Doctorate, etc.", onSelect: selected => onForm({ educationLevel: Nullable_1.nullToUndefined(selected === null || selected === void 0 ? void 0 : selected.value) }) })))),
        React.createElement(NullCollapse_1.NullCollapse, { open: props.form.profile.educationLevel !== undefined },
            React.createElement("div", { className: "mb-1 mt-2" },
                React.createElement("div", { className: "mb-1 font-weight-bold" }, "In what field?"),
                React.createElement("div", { className: "mt-1" },
                    React.createElement(FieldOfStudySelect_1.FieldOfStudySelect, { placeholder: "", onSelect: selected => onForm({ fieldOfStudy: Nullable_1.nullToUndefined(selected === null || selected === void 0 ? void 0 : selected.value) }) })))),
        React.createElement(NullCollapse_1.NullCollapse, { open: props.form.profile.fieldOfStudy !== undefined },
            React.createElement("div", { className: "mb-1 mt-2" },
                React.createElement("div", { className: "mb-1 font-weight-bold" }, "And at what school/university?"),
                React.createElement(UniversitySelect_1.UniversitySelect, { placeholder: "Type to search for your university...", onSelect: selected => onForm({ university: Nullable_1.nullToUndefined(selected === null || selected === void 0 ? void 0 : selected.value) }) })))));
};
//# sourceMappingURL=AcademicProfileConfigurator.js.map