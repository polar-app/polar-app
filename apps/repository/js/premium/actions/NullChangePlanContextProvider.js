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
exports.NullChangePlanContextProvider = void 0;
const React = __importStar(require("react"));
const ChangePlanAction_1 = require("./ChangePlanAction");
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
function useAction() {
    return React.useCallback((newSubscription) => {
        document.location.href = `https://app.getpolarized.io/plans?plan=${newSubscription.plan.level}&interval=${newSubscription.interval}`;
    }, []);
}
exports.NullChangePlanContextProvider = ReactUtils_1.deepMemo((props) => {
    const type = 'buy';
    const action = useAction();
    const subscription = undefined;
    return (React.createElement(ChangePlanAction_1.ChangePlanActionContext.Provider, { value: { type, action, subscription } }, props.children));
});
//# sourceMappingURL=NullChangePlanContextProvider.js.map