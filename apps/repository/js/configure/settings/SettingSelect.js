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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingSelect = void 0;
const MUILogger_1 = require("../../../../../web/js/mui/MUILogger");
const React = __importStar(require("react"));
const PreviewWarning_1 = require("./PreviewWarning");
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
const Select_1 = __importDefault(require("@material-ui/core/Select"));
const PrefsHook_1 = require("../../persistence_layer/PrefsHook");
exports.SettingSelect = (props) => {
    const log = MUILogger_1.useLogger();
    const prefs = PrefsHook_1.usePrefs();
    if (!prefs.value) {
        return null;
    }
    const { name } = props;
    const onChange = (value) => {
        console.log("Setting " + name);
        prefs.value.set(props.name, value);
        const doCommit = () => __awaiter(void 0, void 0, void 0, function* () {
            yield prefs.value.commit();
        });
        doCommit()
            .catch(err => log.error("Could not write prefs: ", err));
    };
    const value = prefs.value.get(props.name)
        .getOrElse(props.options[0].id);
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: 'flex' } },
            React.createElement("div", { className: "mt-auto mb-auto", style: { flexGrow: 1 } },
                React.createElement("h2", null,
                    React.createElement("b", null, props.title))),
            React.createElement("div", { className: "mt-auto mb-auto" },
                React.createElement(Select_1.default, { value: value, onChange: event => onChange(event.target.value) }, props.options.map(current => React.createElement(MenuItem_1.default, { key: current.id, value: current.id }, current.label))))),
        React.createElement("div", null,
            React.createElement("p", { style: { fontSize: '1.3rem' } }, props.description)),
        props.preview && React.createElement(PreviewWarning_1.PreviewWarning, null)));
};
//# sourceMappingURL=SettingSelect.js.map