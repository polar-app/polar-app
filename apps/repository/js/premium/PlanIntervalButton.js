"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanIntervalButton = void 0;
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const PricingStore_1 = require("./PricingStore");
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
exports.PlanIntervalButton = ReactUtils_1.deepMemo(() => {
    const { interval } = PricingStore_1.usePricingStore(['interval']);
    const { toggleInterval } = PricingStore_1.usePricingCallbacks();
    return (react_1.default.createElement(Button_1.default, { color: "secondary", variant: "contained", onClick: toggleInterval },
        "Show ",
        interval === 'month' ? 'Yearly' : 'Monthly',
        " Plans"));
});
//# sourceMappingURL=PlanIntervalButton.js.map