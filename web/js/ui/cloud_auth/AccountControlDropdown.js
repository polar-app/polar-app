"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountControlDropdown = void 0;
const react_1 = __importDefault(require("react"));
const AccountControl_1 = require("./AccountControl");
const MUIPopper_1 = require("../../mui/menu/MUIPopper");
const AccountAvatar_1 = require("./AccountAvatar");
const ReactUtils_1 = require("../../react/ReactUtils");
exports.AccountControlDropdown = ReactUtils_1.deepMemo((props) => (react_1.default.createElement(MUIPopper_1.MUIPopper, { id: "account-control-button", icon: react_1.default.createElement(AccountAvatar_1.AccountAvatar, { size: "small" }), placement: "bottom-end", caret: true },
    react_1.default.createElement(AccountControl_1.AccountControl, { userInfo: props.userInfo }))));
//# sourceMappingURL=AccountControlDropdown.js.map