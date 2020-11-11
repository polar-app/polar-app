"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIPopper = exports.usePopperController = void 0;
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const ClickAwayListener_1 = __importDefault(require("@material-ui/core/ClickAwayListener"));
const Grow_1 = __importDefault(require("@material-ui/core/Grow"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const Popper_1 = __importDefault(require("@material-ui/core/Popper"));
const styles_1 = require("@material-ui/core/styles");
const Functions_1 = require("polar-shared/src/util/Functions");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const MUIDropdownCaret_1 = require("../MUIDropdownCaret");
const ReactUtils_1 = require("../../react/ReactUtils");
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
const PopperControllerContext = react_1.default.createContext({ dismiss: Functions_1.NULL_FUNCTION });
function usePopperController() {
    return react_1.default.useContext(PopperControllerContext);
}
exports.usePopperController = usePopperController;
exports.MUIPopper = ReactUtils_1.deepMemo((props) => {
    const theme = styles_1.useTheme();
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
    const prevOpen = react_1.default.useRef(open);
    react_1.default.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    const buttonProps = {
        onClick: handleToggle || Functions_1.NULL_FUNCTION,
        color: props.color,
        size: props.size,
        variant: props.variant || 'contained',
        ref: anchorRef,
        style: { color: theme.palette.text.secondary }
    };
    const placement = props.placement || 'bottom';
    return (react_1.default.createElement("div", { className: classes.root },
        react_1.default.createElement("div", null,
            props.text && props.icon &&
                react_1.default.createElement(Button_1.default, Object.assign({}, buttonProps, { startIcon: props.icon, endIcon: props.caret ? react_1.default.createElement(MUIDropdownCaret_1.MUIDropdownCaret, null) : undefined }), props.text),
            props.icon && !props.text &&
                react_1.default.createElement(IconButton_1.default, Object.assign({}, buttonProps, { size: buttonProps.size === 'large' ? 'medium' : buttonProps.size }), props.icon),
            !props.icon && props.text &&
                react_1.default.createElement(Button_1.default, Object.assign({}, buttonProps, { size: "large" }), props.text),
            react_1.default.createElement(Popper_1.default, { open: open, className: classes.popper, anchorEl: anchorRef.current, role: undefined, transition: true, popperOptions: {
                    offsets: {
                        popper: {
                            top: 10
                        }
                    }
                }, placement: placement, disablePortal: true }, ({ TransitionProps, placement }) => (react_1.default.createElement(Grow_1.default, Object.assign({}, TransitionProps),
                react_1.default.createElement(Paper_1.default, { elevation: 10, className: classes.paper },
                    react_1.default.createElement(PopperControllerContext.Provider, { value: { dismiss: () => setOpen(false) } },
                        react_1.default.createElement(ClickAwayListener_1.default, { onClickAway: handleClose }, props.children)))))))));
});
//# sourceMappingURL=MUIPopper.js.map