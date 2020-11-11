"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalCssMobile = exports.GlobalCssMobileRoot = exports.GlobalCssMobileRootStyles = void 0;
const react_1 = __importDefault(require("react"));
const withStyles_1 = __importDefault(require("@material-ui/core/styles/withStyles"));
const DeviceRouter_1 = require("../../ui/DeviceRouter");
exports.GlobalCssMobileRootStyles = withStyles_1.default({
    '@global': {
        'html, body': {
            fontSize: '16px',
        },
    },
});
exports.GlobalCssMobileRoot = exports.GlobalCssMobileRootStyles(() => null);
exports.GlobalCssMobile = () => {
    return (react_1.default.createElement(DeviceRouter_1.DeviceRouter, { phone: react_1.default.createElement(exports.GlobalCssMobileRoot, null), tablet: react_1.default.createElement(exports.GlobalCssMobileRoot, null) }));
};
//# sourceMappingURL=GlobalCssMobile.js.map