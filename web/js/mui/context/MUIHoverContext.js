"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIHoverListener = exports.MUIHoverController = exports.MUIHoverTypeContext = void 0;
const react_1 = __importDefault(require("react"));
const Devices_1 = require("polar-shared/src/util/Devices");
exports.MUIHoverTypeContext = react_1.default.createContext(false);
exports.MUIHoverController = (props) => {
    const [active, setActive] = react_1.default.useState(false);
    const device = Devices_1.Devices.get();
    if (device !== "desktop") {
        return props.children;
    }
    const handleToggleActive = (newActive) => {
        setActive(newActive);
    };
    return (react_1.default.createElement("div", { onMouseEnter: () => handleToggleActive(true), onMouseLeave: () => handleToggleActive(false) },
        react_1.default.createElement(exports.MUIHoverTypeContext.Provider, { value: active }, props.children)));
};
exports.MUIHoverListener = (props) => (react_1.default.createElement(exports.MUIHoverTypeContext.Consumer, null, (active) => active && props.children));
//# sourceMappingURL=MUIHoverContext.js.map