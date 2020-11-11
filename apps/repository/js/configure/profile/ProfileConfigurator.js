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
exports.ProfileConfigurator = void 0;
const OccupationSelect_1 = require("./selectors/OccupationSelect");
const react_1 = __importStar(require("react"));
const Nullable_1 = require("polar-shared/src/util/Nullable");
const AcademicProfileConfigurator_1 = require("./AcademicProfileConfigurator");
const BusinessProfileConfigurator_1 = require("./BusinessProfileConfigurator");
const LinearProgress_1 = __importDefault(require("@material-ui/core/LinearProgress"));
exports.ProfileConfigurator = (props) => {
    const [state, setState] = react_1.useState({
        form: {
            profile: {},
            progress: 0
        }
    });
    const onOccupation = (occupation) => {
        console.log("occupation: ", occupation);
        const computeProgress = () => {
            switch (occupation === null || occupation === void 0 ? void 0 : occupation.type) {
                case "academic":
                    return 25;
                case "business":
                    return 50;
                default:
                    return 0;
            }
        };
        const progress = computeProgress();
        const newState = Object.assign(Object.assign({}, state), { form: Object.assign(Object.assign({}, state.form), { progress }), occupation });
        setState(newState);
    };
    const onForm = (form) => {
        var _a;
        console.log("form: ", form);
        setState(Object.assign(Object.assign({}, state), { form }));
        if (form.progress === 100) {
            switch ((_a = state.occupation) === null || _a === void 0 ? void 0 : _a.type) {
                case "academic":
                    props.onOccupationProfile(form.profile);
                    break;
                case "business":
                    props.onOccupationProfile(form.profile);
                    break;
            }
        }
    };
    return (react_1.default.createElement("div", { style: {
            minHeight: '30em',
            display: 'flex',
            flexDirection: 'column'
        }, className: "" },
        react_1.default.createElement("div", { style: { flexGrow: 1 } },
            react_1.default.createElement("div", { className: "mb-1" },
                react_1.default.createElement(LinearProgress_1.default, { variant: "determinate", value: state.form.progress })),
            react_1.default.createElement("div", { className: "font-weight-bold text-xl" }, "Tell us about yourself! "),
            react_1.default.createElement("div", { className: "text-muted text-lg mt-1 mb-1" }, "We use this information to improve Polar specifically for your use case when incorporating your feedback and prioritizing new features."),
            react_1.default.createElement("div", { className: "mt-2" },
                react_1.default.createElement("div", { className: "mb-1 font-weight-bold" }, "What's your occupation?"),
                react_1.default.createElement(OccupationSelect_1.OccupationSelect, { placeholder: "Pick one from the list or create one if necessary.", onSelect: selected => onOccupation(Nullable_1.nullToUndefined(selected === null || selected === void 0 ? void 0 : selected.value)) })),
            state.occupation && state.occupation.type === 'academic' &&
                react_1.default.createElement(AcademicProfileConfigurator_1.AcademicProfileConfigurator, { occupation: state.occupation, form: state.form, onForm: form => onForm(form) }),
            state.occupation && state.occupation.type === 'business' &&
                react_1.default.createElement(BusinessProfileConfigurator_1.BusinessProfileConfigurator, { occupation: state.occupation, form: state.form, onForm: form => onForm(form) }))));
};
//# sourceMappingURL=ProfileConfigurator.js.map