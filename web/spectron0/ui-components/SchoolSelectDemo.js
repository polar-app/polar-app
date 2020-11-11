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
exports.SchoolSelectDemo = exports.SchoolSelectDemo2 = void 0;
const React = __importStar(require("react"));
const UniversitySelect_1 = require("../../../apps/repository/js/configure/profile/selectors/UniversitySelect");
const FieldOfStudySelect_1 = require("../../../apps/repository/js/configure/profile/selectors/FieldOfStudySelect");
const OccupationSelect_1 = require("../../../apps/repository/js/configure/profile/selectors/OccupationSelect");
const ProfileConfigurator_1 = require("../../../apps/repository/js/configure/profile/ProfileConfigurator");
exports.SchoolSelectDemo2 = () => (React.createElement("div", null,
    React.createElement("div", { className: "m-1" },
        React.createElement(OccupationSelect_1.OccupationSelect, { onSelect: selected => console.log({ selected }) })),
    React.createElement("div", { className: "m-1" },
        React.createElement(FieldOfStudySelect_1.FieldOfStudySelect, { onSelect: selected => console.log({ selected }) })),
    React.createElement("div", { className: "m-1" },
        React.createElement(UniversitySelect_1.UniversitySelect, { onSelect: selected => console.log({ selected }) }))));
exports.SchoolSelectDemo = () => (React.createElement("div", null,
    React.createElement(ProfileConfigurator_1.ProfileConfigurator, { onOccupationProfile: profile => console.log("GOT PROFILE: ", { profile }) })));
//# sourceMappingURL=SchoolSelectDemo.js.map