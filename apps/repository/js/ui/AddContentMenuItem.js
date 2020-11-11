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
exports.AddContentMenuItem = void 0;
const React = __importStar(require("react"));
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
const ListItemIcon_1 = __importDefault(require("@material-ui/core/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@material-ui/core/ListItemText"));
const MUITooltip_1 = require("../../../../web/js/mui/MUITooltip");
class AddContentMenuItem extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        if (this.props.hidden) {
            return null;
        }
        return (React.createElement(MUITooltip_1.MUITooltip, { title: this.props.tooltip },
            React.createElement(MenuItem_1.default, { id: this.props.id, onClick: () => this.props.onClick() },
                this.props.children,
                React.createElement(ListItemIcon_1.default, null, this.props.icon),
                React.createElement(ListItemText_1.default, { primary: this.props.text }))));
    }
}
exports.AddContentMenuItem = AddContentMenuItem;
//# sourceMappingURL=AddContentMenuItem.js.map