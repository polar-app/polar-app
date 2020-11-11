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
exports.DeviceScreen = void 0;
const React = __importStar(require("react"));
const DefaultPageLayout_1 = require("../page_layout/DefaultPageLayout");
const DeviceInfo_1 = require("../repo_header/DeviceInfo");
exports.DeviceScreen = (props) => (React.createElement(DefaultPageLayout_1.DefaultPageLayout, Object.assign({}, props),
    React.createElement("div", { className: " text-lg" },
        React.createElement("div", { className: "" },
            React.createElement("h2", null, "Device"),
            React.createElement("p", null, "Information about the user's current device."),
            React.createElement("div", { className: "mt-1" },
                React.createElement(DeviceInfo_1.ExtendedDeviceInfo, null))))));
//# sourceMappingURL=DeviceScreen.js.map