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
exports.MUIMenuItem = void 0;
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
const ListItemIcon_1 = __importDefault(require("@material-ui/core/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@material-ui/core/ListItemText"));
const React = __importStar(require("react"));
const Nav_1 = require("../../ui/util/Nav");
const Analytics_1 = require("../../analytics/Analytics");
exports.MUIMenuItem = React.forwardRef((props, ref) => {
    const onClick = React.useCallback((event) => {
        if (props.onClick) {
            props.onClick(event);
        }
        else if (props.link) {
            Nav_1.Nav.openLinkWithNewTab(props.link);
        }
        if (props.event) {
            if (typeof props.event === 'string') {
                Analytics_1.Analytics.event2(props.event);
            }
            else {
                Analytics_1.Analytics.event2(props.event.name, props.event.data);
            }
        }
    }, [props]);
    return (React.createElement(MenuItem_1.default, { id: props.id, disabled: props.disabled, onClick: onClick },
        props.icon &&
            React.createElement(ListItemIcon_1.default, null, props.icon),
        React.createElement(ListItemText_1.default, { primary: props.text })));
});
//# sourceMappingURL=MUIMenuItem.js.map