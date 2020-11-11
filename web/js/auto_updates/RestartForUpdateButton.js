"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestartForUpdateButton = void 0;
const react_1 = __importDefault(require("react"));
const electron_1 = require("electron");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
function RestartForUpdateButton() {
    return (react_1.default.createElement("div", { style: {
            width: '500px',
            position: 'fixed',
            right: 10,
            bottom: 10,
            zIndex: 9999,
        }, className: "border rounded shadow p-3 m-2 text-white bg-dark" },
        react_1.default.createElement("div", { style: {
                display: 'flex',
                verticalAlign: 'middle'
            }, className: "mb-3" },
            react_1.default.createElement("div", { className: "mr-3 text-success mt-auto mb-auto" },
                react_1.default.createElement("i", { style: { fontSize: '50px' }, className: "fas fa-check" })),
            react_1.default.createElement("div", { className: "mt-1 mb-1" },
                react_1.default.createElement("div", { className: "mb-1", style: { fontSize: '18px' } },
                    react_1.default.createElement("b", null, "Update available."),
                    " Please restart."),
                react_1.default.createElement("div", { className: "mt-1 mb-1 h6" }, "An update was downloaded and ready to be installed. Please restart to install the latest version."))),
        react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: "text-center text-white" },
                react_1.default.createElement(Button_1.default, { onClick: () => electron_1.ipcRenderer.send('app-update:quit-and-install'), size: "large", variant: "contained", color: "primary" }, "Restart")))));
}
exports.RestartForUpdateButton = RestartForUpdateButton;
//# sourceMappingURL=RestartForUpdateButton.js.map