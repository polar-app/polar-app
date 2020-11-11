"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIMenu = void 0;
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const ClickAwayListener_1 = __importDefault(require("@material-ui/core/ClickAwayListener"));
const Grow_1 = __importDefault(require("@material-ui/core/Grow"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const Popper_1 = __importDefault(require("@material-ui/core/Popper"));
const MenuList_1 = __importDefault(require("@material-ui/core/MenuList"));
const styles_1 = require("@material-ui/core/styles");
const Functions_1 = require("polar-shared/src/util/Functions");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const MUIDropdownCaret_1 = require("../MUIDropdownCaret");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    root: {
        display: 'flex',
    },
    popper: {
        zIndex: 1000
    },
    paper: {
        marginTop: '2px'
    },
}));
exports.MUIMenu = react_1.default.memo(react_1.default.forwardRef((props, ref) => {
    const classes = useStyles();
    const [open, setOpen] = react_1.default.useState(false);
    const anchorRef = react_1.default.useRef(null);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }
    const buttonProps = {
        onClick: handleToggle || Functions_1.NULL_FUNCTION,
        color: props.button.color,
        size: props.button.size,
        ref: anchorRef,
        variant: props.button.variant || 'contained',
        disabled: props.button.disabled,
        disableRipple: props.button.disableRipple,
        disableFocusRipple: props.button.disableFocusRipple,
        style: props.button.style
    };
    const placement = props.placement || 'bottom';
    const id = props.id || 'dropdown';
    const menuListID = id + "-menu-list-grow";
    return (react_1.default.createElement("div", { className: classes.root },
        react_1.default.createElement("div", null,
            props.button.text && props.button.icon &&
                react_1.default.createElement(Button_1.default, Object.assign({}, buttonProps, { startIcon: props.button.icon, endIcon: props.caret ? react_1.default.createElement(MUIDropdownCaret_1.MUIDropdownCaret, null) : undefined }), props.button.text),
            props.button.icon && !props.button.text &&
                react_1.default.createElement(IconButton_1.default, Object.assign({}, buttonProps, { size: buttonProps.size === 'large' ? 'medium' : buttonProps.size }), props.button.icon),
            !props.button.icon && props.button.text &&
                react_1.default.createElement(Button_1.default, Object.assign({}, buttonProps, { size: "large", variant: "contained" }), props.button.text),
            react_1.default.createElement(Popper_1.default, { open: open, className: classes.popper, anchorEl: anchorRef.current, role: undefined, transition: true, popperOptions: {
                    offsets: {
                        popper: {
                            top: 10
                        }
                    }
                }, placement: placement, disablePortal: true }, ({ TransitionProps, placement }) => (react_1.default.createElement(Grow_1.default, Object.assign({}, TransitionProps),
                react_1.default.createElement(Paper_1.default, { elevation: 10, className: classes.paper },
                    react_1.default.createElement(ClickAwayListener_1.default, { onClickAway: handleClose },
                        react_1.default.createElement(MenuList_1.default, { autoFocusItem: open, id: menuListID, onClick: handleClose, onKeyDown: handleListKeyDown }, props.children)))))))));
}), react_fast_compare_1.default);
//# sourceMappingURL=MUIMenu.js.map