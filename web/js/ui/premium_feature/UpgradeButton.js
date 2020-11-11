"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeButton = void 0;
const react_router_dom_1 = require("react-router-dom");
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const LockOpen_1 = __importDefault(require("@material-ui/icons/LockOpen"));
const ReactUtils_1 = require("../../react/ReactUtils");
exports.UpgradeButton = ReactUtils_1.deepMemo((props) => {
    const history = react_router_dom_1.useHistory();
    const { required, feature } = props;
    return (react_1.default.createElement(Button_1.default, { variant: "contained", size: "small", className: "border", startIcon: react_1.default.createElement(LockOpen_1.default, null), onClick: () => history.push("/plans") },
        "Upgrade to ",
        required,
        " to unlock ",
        feature));
});
//# sourceMappingURL=UpgradeButton.js.map