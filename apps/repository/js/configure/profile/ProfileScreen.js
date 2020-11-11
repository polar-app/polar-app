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
exports.ProfileScreen = void 0;
const DefaultPageLayout_1 = require("../../page_layout/DefaultPageLayout");
const React = __importStar(require("react"));
const ProfileConfigurator_1 = require("./ProfileConfigurator");
const ConfigureNavbar_1 = require("../ConfigureNavbar");
const ConfigureBody_1 = require("../ConfigureBody");
exports.ProfileScreen = (props) => {
    const onProfile = (profile) => {
    };
    return (React.createElement(DefaultPageLayout_1.DefaultPageLayout, Object.assign({}, props),
        React.createElement(ConfigureBody_1.ConfigureBody, null,
            React.createElement(ConfigureNavbar_1.ConfigureNavbar, null),
            React.createElement(ProfileConfigurator_1.ProfileConfigurator, { onOccupationProfile: occupationProfile => onProfile(occupationProfile) }))));
};
//# sourceMappingURL=ProfileScreen.js.map