"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabbedBrowserDemo = void 0;
const react_1 = __importDefault(require("react"));
const AppBar_1 = __importDefault(require("@material-ui/core/AppBar"));
const Tabs_1 = __importDefault(require("@material-ui/core/Tabs"));
const Tab_1 = __importDefault(require("@material-ui/core/Tab"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const PolarSVGIcon_1 = require("../../js/ui/svg_icons/PolarSVGIcon");
function TabPanel(props) {
    const { children, value, index } = props, other = __rest(props, ["children", "value", "index"]);
    const display = value === index ? 'flex' : 'none';
    return (react_1.default.createElement("div", Object.assign({ role: "tabpanel", style: {
            flexGrow: 1,
            display
        }, id: `scrollable-auto-tabpanel-${index}`, "aria-labelledby": `scrollable-auto-tab-${index}` }, other), children));
}
function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}
const useStyles = makeStyles_1.default((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    tabs: {
        paddingTop: '2px',
        textTransform: 'none',
        minHeight: '1.2em',
        flexShrink: 1,
        flexGrow: 1,
        "& button + button span:first-child": {
            borderLeft: '1px solid ' + theme.palette.divider,
        },
    },
    tab: {
        color: theme.palette.text.secondary,
        padding: 0,
        textTransform: 'none',
        minHeight: '1.2em',
        flex: '1 1 0',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minWidth: 0,
        overflow: 'auto',
        overflowX: 'auto',
        overflowY: 'auto',
        '&:hover': {
            backgroundColor: theme.palette.background.default,
        },
        '&$selected, &$selected:hover': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
        },
        '&$selected, &:hover': {},
        "&$selected span:first-child, &:hover span:first-child": {
            borderLeft: '1px solid transparent',
        },
        "&$selected + button span:first-child, &:hover + button span:first-child": {
            borderLeft: '1px solid transparent',
        },
    },
    wrapper: {
        marginTop: '5px',
        marginBottom: '5px',
        paddingLeft: '10px',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        "webkit-mask-image": "linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent)",
        maskImage: "linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent)",
    },
    selected: {},
}));
const BrowserTab = react_1.default.memo((props) => {
    const classes = useStyles();
    return (react_1.default.createElement(Tab_1.default, Object.assign({ className: classes.tab, classes: {
            wrapper: classes.wrapper,
            selected: props.selected ? classes.selected : undefined
        }, label: props.label, selected: true }, a11yProps(props.value), { value: props.value, onChange: props.onChange })));
}, react_fast_compare_1.default);
exports.TabbedBrowserDemo = () => {
    const [value, setValue] = react_1.default.useState(0);
    const classes = useStyles();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (react_1.default.createElement("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
        } },
        react_1.default.createElement(AppBar_1.default, { position: "static", color: "default", style: { flexDirection: 'row' } },
            react_1.default.createElement("div", null,
                react_1.default.createElement(PolarSVGIcon_1.PolarSVGIcon, { width: 32, height: 32 })),
            react_1.default.createElement(Tabs_1.default, { className: classes.tabs, value: value, onChange: handleChange, variant: "scrollable", scrollButtons: "auto", "aria-label": "scrollable auto tabs example" },
                react_1.default.createElement(BrowserTab, { label: "Disney", value: 0, selected: value === 0 }),
                react_1.default.createElement(BrowserTab, { label: "Hello world", value: 1, selected: value === 1 }),
                react_1.default.createElement(BrowserTab, { label: "Centers for Disease Control and Prevention", value: 2, selected: value === 2 }),
                react_1.default.createElement(BrowserTab, { label: "Tab 4", value: 3, selected: value === 3 }),
                react_1.default.createElement(BrowserTab, { label: "Tab 5", value: 4, selected: value === 4 }),
                react_1.default.createElement(BrowserTab, { label: "Tab 6", value: 5, selected: value === 5 }),
                react_1.default.createElement(BrowserTab, { label: "Tab 7", value: 6, selected: value === 6 }),
                react_1.default.createElement(BrowserTab, { label: "Tab 8", value: 7, selected: value === 7 }),
                react_1.default.createElement(BrowserTab, { label: "Tab 9", value: 8, selected: value === 8 }))),
        react_1.default.createElement(Divider_1.default, null),
        react_1.default.createElement(TabPanel, { value: value, index: 0 },
            react_1.default.createElement("iframe", { src: "https://www.disney.com", frameBorder: "0", style: { flexGrow: 1 } })),
        react_1.default.createElement(TabPanel, { value: value, index: 1 },
            react_1.default.createElement("iframe", { src: "https://www.stackoverflow.com", frameBorder: "0", style: { flexGrow: 1 } })),
        react_1.default.createElement(TabPanel, { value: value, index: 2 },
            react_1.default.createElement("iframe", { src: "https://www.cdc.gov", frameBorder: "0", style: { flexGrow: 1 } })),
        react_1.default.createElement(TabPanel, { value: value, index: 3 }, "Item Four"),
        react_1.default.createElement(TabPanel, { value: value, index: 4 }, "Item Five"),
        react_1.default.createElement(TabPanel, { value: value, index: 5 }, "Item Six"),
        react_1.default.createElement(TabPanel, { value: value, index: 6 }, "Item Seven")));
};
//# sourceMappingURL=TabbedBrowserDemo.js.map