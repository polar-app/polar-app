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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessProfileConfigurator = void 0;
const React = __importStar(require("react"));
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Percentages_1 = require("polar-shared/src/util/Percentages");
const Input_1 = __importDefault(require("@material-ui/core/Input"));
exports.BusinessProfileConfigurator = (props) => {
    const onForm = (newProfile) => {
        const occupation = props.occupation;
        const profile = Object.assign(Object.assign({ occupation }, props.form.profile), newProfile);
        const computeProgress = () => {
            const tasks = [
                props.occupation,
                profile.domain,
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
    const onURL = (url) => {
        try {
            const parsedURL = new URL(url);
            onForm({
                domainOrURL: url,
                domain: parsedURL.hostname
            });
        }
        catch (e) {
            onForm({
                domainOrURL: undefined,
                domain: undefined
            });
        }
    };
    return (React.createElement("div", { className: "mb-1 mt-2" },
        React.createElement("div", { className: "mb-1 font-weight-bold" }, "What's the URL for your company?"),
        React.createElement("div", { className: "mt-1" },
            React.createElement(Input_1.default, { type: "url", autoFocus: true, onChange: event => onURL(event.currentTarget.value) }))));
};
//# sourceMappingURL=BusinessProfileConfigurator.js.map