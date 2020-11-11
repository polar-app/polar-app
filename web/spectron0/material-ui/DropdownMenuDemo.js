"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Menu_1 = __importDefault(require("@material-ui/core/Menu"));
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
const ListItemIcon_1 = __importDefault(require("@material-ui/core/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@material-ui/core/ListItemText"));
const MoveToInbox_1 = __importDefault(require("@material-ui/icons/MoveToInbox"));
const Drafts_1 = __importDefault(require("@material-ui/icons/Drafts"));
const Send_1 = __importDefault(require("@material-ui/icons/Send"));
const StyledMenu = styles_1.withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (react_1.default.createElement(Menu_1.default, Object.assign({ elevation: 0, getContentAnchorEl: null, anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
    }, transformOrigin: {
        vertical: 'top',
        horizontal: 'center',
    } }, props))));
const StyledMenuItem = styles_1.withStyles((theme) => ({
    root: {},
}))(MenuItem_1.default);
function DropdownMenuDemo() {
    const [anchorEl, setAnchorEl] = react_1.default.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(Button_1.default, { "aria-controls": "customized-menu", "aria-haspopup": "true", variant: "contained", color: "default", onClick: handleClick }, "+ Add"),
        react_1.default.createElement(StyledMenu, { id: "customized-menu", anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: handleClose },
            react_1.default.createElement(StyledMenuItem, { onClick: () => console.log('click') },
                react_1.default.createElement(ListItemIcon_1.default, null,
                    react_1.default.createElement(Send_1.default, { fontSize: "small" })),
                react_1.default.createElement(ListItemText_1.default, { primary: "Sent mail" })),
            react_1.default.createElement(StyledMenuItem, null,
                react_1.default.createElement(ListItemIcon_1.default, null,
                    react_1.default.createElement(Drafts_1.default, { fontSize: "small" })),
                react_1.default.createElement(ListItemText_1.default, { primary: "Drafts" })),
            react_1.default.createElement(StyledMenuItem, null,
                react_1.default.createElement(ListItemIcon_1.default, null,
                    react_1.default.createElement(MoveToInbox_1.default, { fontSize: "small" })),
                react_1.default.createElement(ListItemText_1.default, { primary: "Inbox" })))));
}
exports.default = DropdownMenuDemo;
//# sourceMappingURL=DropdownMenuDemo.js.map