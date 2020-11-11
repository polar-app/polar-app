"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountControlSidebar = void 0;
const react_1 = __importDefault(require("react"));
const RightSidebar_1 = require("../../../web/js/ui/motion/RightSidebar");
const AccountControl_1 = require("../../../web/js/ui/cloud_auth/AccountControl");
const DeviceRouter_1 = require("../../../web/js/ui/DeviceRouter");
const UserInfoProvider_1 = require("../../../web/js/apps/repository/auth_handler/UserInfoProvider");
const ReactUtils_1 = require("../../../web/js/react/ReactUtils");
const AccountInfo = (props) => {
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    if (userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) {
        return react_1.default.createElement(AccountControl_1.AccountControl, Object.assign({}, props, { userInfo: userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo }));
    }
    else {
        return react_1.default.createElement("h2", null, "Please Login");
    }
};
const AccountDataLoader = (props) => (react_1.default.createElement("div", { className: "p-2" },
    react_1.default.createElement(AccountInfo, Object.assign({}, props))));
var devices;
(function (devices) {
    const onClose = () => window.history.back();
    devices.Phone = (props) => (react_1.default.createElement(RightSidebar_1.RightSidebar, { onClose: () => onClose(), fullscreen: true },
        react_1.default.createElement(AccountDataLoader, Object.assign({}, props))));
    devices.TabletAndDesktop = (props) => (react_1.default.createElement(RightSidebar_1.RightSidebar, { onClose: () => onClose() },
        react_1.default.createElement(AccountDataLoader, Object.assign({}, props))));
})(devices || (devices = {}));
exports.AccountControlSidebar = ReactUtils_1.deepMemo((props) => (react_1.default.createElement(DeviceRouter_1.DeviceRouter, { phone: react_1.default.createElement(devices.Phone, Object.assign({}, props)), tablet: react_1.default.createElement(devices.TabletAndDesktop, Object.assign({}, props)), desktop: react_1.default.createElement(devices.TabletAndDesktop, Object.assign({}, props)) })));
//# sourceMappingURL=AccountControlSidebar.js.map