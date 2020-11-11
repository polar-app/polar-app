"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleDropdownMenu = void 0;
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const ClickAwayListener_1 = __importDefault(require("@material-ui/core/ClickAwayListener"));
const Grow_1 = __importDefault(require("@material-ui/core/Grow"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const Popper_1 = __importDefault(require("@material-ui/core/Popper"));
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
const MenuList_1 = __importDefault(require("@material-ui/core/MenuList"));
const styles_1 = require("@material-ui/core/styles");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    root: {
        display: 'flex',
    },
    popper: {
        zIndex: 1000
    },
    paper: {
        marginTop: theme.spacing(1),
    },
}));
function ExampleDropdownMenu() {
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
    const prevOpen = react_1.default.useRef(open);
    react_1.default.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    return (react_1.default.createElement("div", { className: classes.root },
        react_1.default.createElement("div", null,
            react_1.default.createElement(Button_1.default, { ref: anchorRef, "aria-controls": open ? 'menu-list-grow' : undefined, "aria-haspopup": "true", onClick: handleToggle }, "Toggle Menu Grow"),
            react_1.default.createElement(Popper_1.default, { open: open, className: classes.popper, anchorEl: anchorRef.current, role: undefined, transition: true, disablePortal: true }, ({ TransitionProps, placement }) => (react_1.default.createElement(Grow_1.default, Object.assign({}, TransitionProps, { style: { transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' } }),
                react_1.default.createElement(Paper_1.default, { elevation: 10, className: classes.paper },
                    react_1.default.createElement(ClickAwayListener_1.default, { onClickAway: handleClose },
                        react_1.default.createElement(MenuList_1.default, { autoFocusItem: open, id: "menu-list-grow", style: { backgroundColor: 'white' }, onKeyDown: handleListKeyDown },
                            react_1.default.createElement(MenuItem_1.default, { onClick: handleClose, style: { backgroundColor: 'white' } }, "Profile"),
                            react_1.default.createElement(MenuItem_1.default, { onClick: handleClose }, "My account"),
                            react_1.default.createElement(MenuItem_1.default, { onClick: handleClose }, "Logout"))))))))));
}
exports.ExampleDropdownMenu = ExampleDropdownMenu;
//# sourceMappingURL=ExampleDropdownMenu.js.map