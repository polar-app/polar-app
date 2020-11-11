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
exports.ScrollAutoLoader = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const react_visibility_sensor_1 = __importDefault(require("react-visibility-sensor"));
const EmptyDiv = (props) => {
    let ref;
    return (React.createElement("div", { ref: _ref => ref = _ref, style: { height: props.height } }));
};
exports.ScrollAutoLoader = (props) => {
    const [state, setState] = react_1.useState({
        isVisible: false,
        height: props.defaultHeight
    });
    console.log("FIXME: height is being defined: ");
    let height = props.defaultHeight;
    const handleChange = (isVisible) => {
        console.log("FIXME: isVisible: ", isVisible);
        setState(Object.assign(Object.assign({}, state), { isVisible }));
    };
    const containment = document.getElementById('containment') || undefined;
    console.log("FIXME2: containment: ", containment);
    return (React.createElement(react_visibility_sensor_1.default, { intervalCheck: false, scrollCheck: true, scrollDelay: 0, partialVisibility: true, resizeCheck: true, resizeDelay: 0, onChange: isVisible => handleChange(isVisible) },
        React.createElement(React.Fragment, null, state.isVisible === true ?
            React.createElement("div", { ref: ref => {
                    height = (ref === null || ref === void 0 ? void 0 : ref.clientHeight) || props.defaultHeight;
                    console.log("FIXME heiht is now: " + height);
                } }, props.children)
            :
                React.createElement(EmptyDiv, { height: state.height }))));
};
//# sourceMappingURL=ScrollAutoLoader.js.map