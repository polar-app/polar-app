"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIMenuPopper = void 0;
const react_1 = __importDefault(require("react"));
const ClickAwayListener_1 = __importDefault(require("@material-ui/core/ClickAwayListener"));
const Grow_1 = __importDefault(require("@material-ui/core/Grow"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const Popper_1 = __importDefault(require("@material-ui/core/Popper"));
const MenuList_1 = __importDefault(require("@material-ui/core/MenuList"));
const styles_1 = require("@material-ui/core/styles");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const useStyles = styles_1.makeStyles(() => styles_1.createStyles({
    popper: {
        zIndex: 1000
    },
    paper: {
        marginTop: '2px'
    },
}));
exports.MUIMenuPopper = react_1.default.memo((props) => {
    const classes = useStyles();
    const { anchorRef, onClosed } = props;
    const handleClose = react_1.default.useCallback((event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        onClosed();
    }, [anchorRef, onClosed]);
    const handleListKeyDown = react_1.default.useCallback((event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            onClosed();
        }
    }, [onClosed]);
    const placement = props.placement || 'bottom';
    const id = props.id || 'dropdown';
    const menuListID = id + "-menu-list-grow";
    return (react_1.default.createElement(Popper_1.default, { open: props.open, className: classes.popper, anchorEl: anchorRef.current, role: undefined, transition: true, popperOptions: {
            offsets: {
                popper: {
                    top: 50
                }
            }
        }, placement: placement, disablePortal: true }, ({ TransitionProps }) => (react_1.default.createElement(Grow_1.default, Object.assign({}, TransitionProps),
        react_1.default.createElement(Paper_1.default, { elevation: 10, className: classes.paper },
            react_1.default.createElement(ClickAwayListener_1.default, { onClickAway: handleClose },
                react_1.default.createElement(MenuList_1.default, { autoFocusItem: props.open, id: menuListID, onClick: handleClose, onKeyDown: handleListKeyDown }, props.children)))))));
}, react_fast_compare_1.default);
//# sourceMappingURL=MUIMenuPopper.js.map