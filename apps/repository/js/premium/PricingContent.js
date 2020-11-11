"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingContent = void 0;
const react_1 = __importDefault(require("react"));
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const PricingContentForMobile_1 = require("./PricingContentForMobile");
const PricingContentForDesktop_1 = require("./PricingContentForDesktop");
exports.PricingContent = () => {
    return (react_1.default.createElement(DeviceRouter_1.DeviceRouter, { handheld: react_1.default.createElement(PricingContentForMobile_1.PricingContentForMobile, null), desktop: react_1.default.createElement(PricingContentForDesktop_1.PricingContentForDesktop, null) }));
};
//# sourceMappingURL=PricingContent.js.map