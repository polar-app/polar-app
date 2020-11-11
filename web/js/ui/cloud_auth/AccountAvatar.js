"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAvatar = void 0;
const react_1 = __importDefault(require("react"));
const UserAvatar_1 = require("./UserAvatar");
const UserInfoProvider_1 = require("../../apps/repository/auth_handler/UserInfoProvider");
exports.AccountAvatar = react_1.default.memo((props) => {
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    if (!userInfoContext) {
        return null;
    }
    if (!userInfoContext.userInfo) {
        return null;
    }
    const { userInfo } = userInfoContext;
    return (react_1.default.createElement(UserAvatar_1.UserAvatar, { size: props.size, displayName: userInfo.displayName, style: props.style, photoURL: userInfo.photoURL }));
});
//# sourceMappingURL=AccountAvatar.js.map