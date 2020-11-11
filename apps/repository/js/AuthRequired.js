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
exports.AuthRequired = void 0;
const React = __importStar(require("react"));
const AuthHandler_1 = require("../../../web/js/apps/repository/auth_handler/AuthHandler");
const UserInfoProvider_1 = require("../../../web/js/apps/repository/auth_handler/UserInfoProvider");
exports.AuthRequired = React.memo((props) => {
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    if (!userInfoContext) {
        return null;
    }
    if (!userInfoContext.userInfo) {
        console.warn("No userInfo: forcing authentication");
        const authHandler = AuthHandler_1.AuthHandlers.get();
        authHandler.authenticate(document.location.href);
        return null;
    }
    return props.children;
});
//# sourceMappingURL=AuthRequired.js.map