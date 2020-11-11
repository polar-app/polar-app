"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeTab = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@material-ui/core");
const styles_1 = require("@material-ui/core/styles");
const react_router_dom_1 = require("react-router-dom");
const Close_1 = __importDefault(require("@material-ui/icons/Close"));
const TAB_CLOSE_TIME = 200;
function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        "aria-controls": `scrollable-auto-tabpanel-${index}`
    };
}
const useStyles = styles_1.makeStyles((theme) => ({
    tab: {
        position: "relative",
        padding: 0,
        textTransform: "none",
        minHeight: "3em",
        maxHeight: "3em",
        maxWidth: "0px",
        transition: `max-width ${TAB_CLOSE_TIME}ms`,
        flex: "1 1 0",
        justifyContent: "flex-start",
        alignItems: "center",
        minWidth: 0,
        "& + &": {
            borderLeft: "1px solid " + theme.palette.divider,
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px"
        },
        "&:hover": {
            backgroundColor: theme.palette.background.default,
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px"
        },
        "&$selected, &$selected:hover": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderLeft: "1px solid transparent",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px"
        },
        "&$selected + &, &:hover + &, &:hover": {
            borderLeft: "1px solid transparent"
        }
    },
    tabOpened: {
        maxWidth: "160px"
    },
    tabClosed: {
        maxWidth: "0px"
    },
    wrapper: {
        marginTop: "5px",
        marginBottom: "5px",
        paddingLeft: "10px",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        textAlign: "left",
        whiteSpace: "nowrap",
        overflow: "hidden"
    },
    selected: {},
    tabLabelContainer: {
        width: "100%"
    },
    gradient: {
        WebkitMaskImage: "linear-gradient(90deg, #000 0%, #000 calc(100% - 36px), transparent calc(100% - 24px))"
    },
    closeButton: {
        position: "absolute",
        right: "10px",
        top: "8px"
    },
    closeButtonHighlight: {
        opacity: 0,
        "&:hover": {
            opacity: 1
        }
    }
}));
const ChromeTabLabel = (props) => {
    const classes = useStyles();
    const iconHeight = 8;
    const circleRadius = 8;
    return (react_1.default.createElement("div", { className: classes.tabLabelContainer },
        react_1.default.createElement("div", { className: `${classes.tabLabelContainer} ${classes.gradient}` },
            react_1.default.createElement("span", null, props.label)),
        props.onClose !== undefined && (react_1.default.createElement("div", { className: classes.closeButton, onClick: props.onClose },
            react_1.default.createElement(Close_1.default, null)))));
};
exports.ChromeTab = (props) => {
    const [startX, setStartX] = react_1.default.useState(-1);
    const [holdX, setHoldX] = react_1.default.useState(undefined);
    const [close, setClose] = react_1.default.useState(false);
    const [open, setOpen] = react_1.default.useState(false);
    const [initial, setInitial] = react_1.default.useState(true);
    const tabRef = react_1.default.useRef();
    const currentTab = tabRef.current;
    const classes = useStyles();
    const draggable = props.onDrag !== undefined;
    const updateX = () => {
        props.onUpdateX(tabRef.current.getBoundingClientRect().x, props.positionIndex);
    };
    const handleClose = () => {
        const finishClose = props.onClose();
        setClose(true);
        setTimeout(() => {
            finishClose();
        }, TAB_CLOSE_TIME);
    };
    const handleMouseDown = (event) => {
        if (event.button === 0) {
            props.onChange(event, props.positionIndex);
        }
        else if (event.button === 1 && props.onClose !== undefined) {
            handleClose();
        }
    };
    react_1.default.useEffect(() => {
        if (!open) {
            setOpen(true);
        }
        if (holdX !== undefined) {
            const currentX = currentTab.getBoundingClientRect().x;
            setStartX(startX + (currentX - holdX));
            setHoldX(undefined);
        }
        else if (props.shouldUpdateX) {
            updateX();
        }
    });
    const handleDragStart = (event) => {
        event.dataTransfer.setDragImage(new Image(), 0, 0);
        setStartX(event.clientX);
    };
    const handleDrag = (event) => {
        event.preventDefault();
        if (holdX === undefined) {
            currentTab.style.left = event.clientX - startX + "px";
            currentTab.style.zIndex = "1";
            const currentX = currentTab.getBoundingClientRect().x;
            if (currentX < 0) {
                return;
            }
            const swapped = props.onDrag(currentX, props.positionIndex);
            if (swapped) {
                setHoldX(currentX);
            }
        }
    };
    const handleDragEnd = (event) => {
        const tabStyle = currentTab.style;
        tabStyle.left = "0px";
        tabStyle.zIndex = "";
    };
    return (react_1.default.createElement(core_1.Tab, Object.assign({ ref: tabRef, className: `${classes.tab} ${open && classes.tabOpened} ${close && classes.tabClosed}`, classes: {
            wrapper: classes.wrapper,
            selected: props.positionIndex === props.currentValue
                ? classes.selected
                : undefined
        }, draggable: draggable, onDrag: handleDrag, onDragEnd: handleDragEnd, onDragStart: handleDragStart, label: react_1.default.createElement(ChromeTabLabel, { label: props.label, onClose: props.onClose === undefined ? undefined : handleClose }), selected: props.positionIndex === props.currentValue }, a11yProps(props.positionIndex), { value: props.positionIndex, disableTouchRipple: true, disableFocusRipple: true, onMouseDown: handleMouseDown, component: react_router_dom_1.Link, to: props.url })));
};
//# sourceMappingURL=ChromeTab.js.map