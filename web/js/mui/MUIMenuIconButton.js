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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIMenuIconButton = void 0;
const React = __importStar(require("react"));
const MUIMenu_1 = require("./menu/MUIMenu");
const MoreVert_1 = __importDefault(require("@material-ui/icons/MoreVert"));
exports.MUIMenuIconButton = (props) => {
    const size = props.size || 'small';
    const placement = props.placement || 'bottom-end';
    return (React.createElement(MUIMenu_1.MUIMenu, { button: {
            icon: React.createElement(MoreVert_1.default, null),
            disabled: props.disabled,
            size
        }, disabled: props.disabled, placement: placement }, props.children));
};
//# sourceMappingURL=MUIMenuIconButton.js.map