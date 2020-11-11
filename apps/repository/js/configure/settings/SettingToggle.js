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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingToggle = void 0;
const MUILogger_1 = require("../../../../../web/js/mui/MUILogger");
const SwitchButton_1 = require("../../../../../web/js/ui/SwitchButton");
const React = __importStar(require("react"));
const FeatureToggles_1 = require("polar-shared/src/util/FeatureToggles");
const PreviewWarning_1 = require("./PreviewWarning");
exports.SettingToggle = (props) => {
    const log = MUILogger_1.useLogger();
    const { prefs, name, defaultValue } = props;
    if (!prefs) {
        return null;
    }
    const value = prefs.isMarked(name, defaultValue);
    const onChange = (value) => {
        console.log("Setting " + name);
        FeatureToggles_1.FeatureToggles.set(name, value);
        prefs.mark(name, value);
        if (props.onChange) {
            props.onChange(value);
        }
        const doCommit = () => __awaiter(void 0, void 0, void 0, function* () {
            yield prefs.commit();
            console.log("Prefs written");
        });
        doCommit()
            .catch(err => log.error("Could not write prefs: ", err));
    };
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: 'flex' } },
            React.createElement("div", { className: "mt-auto mb-auto", style: { flexGrow: 1 } },
                React.createElement("h2", null,
                    React.createElement("b", null, props.title))),
            React.createElement("div", { className: "mt-auto mb-auto" },
                React.createElement(SwitchButton_1.SwitchButton, { size: "medium", initialValue: value, onChange: value => onChange(value) }))),
        React.createElement("div", null,
            React.createElement("p", { style: { fontSize: '1.3rem' } }, props.description)),
        props.preview && React.createElement(PreviewWarning_1.PreviewWarning, null)));
};
//# sourceMappingURL=SettingToggle.js.map