"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginButton = void 0;
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
exports.LoginButton = react_1.default.memo((props) => (react_1.default.createElement(Button_1.default, { id: "enable-cloud-sync", color: "primary", variant: "contained", onClick: () => props.onClick() },
    react_1.default.createElement("span", { className: "d-none-mobile" }, "Login"))));
//# sourceMappingURL=LoginButton.js.map