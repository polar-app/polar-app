"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUISubMenu = void 0;
const react_1 = __importDefault(require("react"));
const Menu_1 = __importDefault(require("@material-ui/core/Menu"));
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
const ListItemIcon_1 = __importDefault(require("@material-ui/core/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@material-ui/core/ListItemText"));
const ArrowRight_1 = __importDefault(require("@material-ui/icons/ArrowRight"));
function MUISubMenu(props) {
    const [anchorEl, setAnchorEl] = react_1.default.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(MenuItem_1.default, { id: props.id, "aria-controls": "simple-menu", "aria-haspopup": "true", onMouseOver: handleClick },
            props.icon &&
                react_1.default.createElement(ListItemIcon_1.default, null, props.icon),
            react_1.default.createElement(ListItemText_1.default, { primary: props.text }),
            react_1.default.createElement(ArrowRight_1.default, null)),
        react_1.default.createElement(Menu_1.default, { id: "simple-menu", anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), getContentAnchorEl: null, anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
            }, transformOrigin: {
                vertical: 'center',
                horizontal: 'left',
            }, onClose: handleClose }, props.children)));
}
exports.MUISubMenu = MUISubMenu;
//# sourceMappingURL=MUISubMenu.js.map