"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileGateway = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const Platforms_1 = require("polar-shared/src/util/Platforms");
const MobileGatewayDialog_1 = require("./MobileGatewayDialog");
const Devices_1 = require("polar-shared/src/util/Devices");
exports.MobileGateway = ReactUtils_1.deepMemo((props) => {
    function isMobile() {
        if (Platforms_1.Platforms.isMobile()) {
            return true;
        }
        if (Devices_1.Devices.isPhone()) {
            return true;
        }
        if (Devices_1.Devices.isTablet()) {
            return true;
        }
        return false;
    }
    if (isMobile()) {
        return (react_1.default.createElement(MobileGatewayDialog_1.MobileGatewayDialog, null));
    }
    else {
        return props.children;
    }
});
//# sourceMappingURL=MobileGateway.js.map