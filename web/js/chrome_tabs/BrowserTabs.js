"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserTabs = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@material-ui/core");
const react_router_dom_1 = require("react-router-dom");
const ChromeTab_1 = require("./ChromeTab");
const BrowserTabsStore_1 = require("./BrowserTabsStore");
const useStyles = core_1.makeStyles((theme) => ({
    tabs: {
        paddingTop: "2px",
        textTransform: "none",
        minHeight: "1.2em",
        flexShrink: 1,
        flexGrow: 1
    },
    tabsIndicator: {
        backgroundColor: "transparent"
    }
}));
exports.BrowserTabs = () => {
    const classes = useStyles();
    const history = react_router_dom_1.useHistory();
    const tabPositionRef = react_1.default.useRef([-1]);
    const { activeTab, tabs, tabContents } = BrowserTabsStore_1.useBrowserTabsStore([
        "activeTab",
        "tabs",
        "tabContents"
    ]);
    const { setActiveTab, addTab, removeTab, swapTabs } = BrowserTabsStore_1.useBrowserTabsCallbacks();
    react_1.default.useEffect(() => {
        while (tabs.length > tabPositionRef.current.length) {
            tabPositionRef.current.push(-1);
            tabPositionRef.current.fill(-1);
        }
    }, [tabs.length]);
    react_1.default.useEffect(() => {
        if (activeTab) {
            history.push(tabs[activeTab].url);
        }
    }, [activeTab, history, tabs]);
    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    const closeTab = (positionIndex) => {
        if (activeTab === positionIndex) {
            const newActiveTab = Math.max(activeTab - 1, 0);
            setActiveTab(newActiveTab);
        }
        const finishClose = () => {
            removeTab(positionIndex);
            tabPositionRef.current = tabPositionRef.current.splice(positionIndex, 1);
            tabPositionRef.current.fill(-1);
        };
        return finishClose;
    };
    const handleUpdateX = (x, positionIndex) => {
        tabPositionRef.current[positionIndex] = x;
    };
    const getUpdateX = () => {
        return tabPositionRef.current.includes(-1);
    };
    const handleDrag = (x, positionIndex) => {
        const calculateMidpoint = (leftIndex) => {
            const val1 = tabPositionRef.current[leftIndex] / 2;
            const val2 = tabPositionRef.current[leftIndex + 1] / 2;
            return val1 + val2;
        };
        if (positionIndex > 0) {
            const leftBoundary = calculateMidpoint(positionIndex - 1);
            if (x < leftBoundary) {
                swapTabs(positionIndex, positionIndex - 1);
                setActiveTab(positionIndex - 1);
                return true;
            }
        }
        if (positionIndex < tabPositionRef.current.length - 1) {
            const rightBoundary = calculateMidpoint(positionIndex);
            if (x > rightBoundary) {
                swapTabs(positionIndex, positionIndex + 1);
                setActiveTab(positionIndex + 1);
                return true;
            }
        }
        return false;
    };
    return (react_1.default.createElement("div", { style: {} },
        react_1.default.createElement(core_1.AppBar, { position: "static", color: "default", style: { flexDirection: "row" } },
            react_1.default.createElement(core_1.Tabs, { className: classes.tabs, classes: { indicator: classes.tabsIndicator }, value: activeTab, onChange: handleChange, scrollButtons: "off", "aria-label": "scrollable auto tabs example" }, tabs.map((tabDescriptor, positionIndex) => (react_1.default.createElement(ChromeTab_1.ChromeTab, { label: tabDescriptor.title, url: tabDescriptor.url, positionIndex: positionIndex, onChange: handleChange, tabIndex: tabDescriptor.tabContentIndex, currentValue: activeTab, key: tabDescriptor.tabContentIndex, onClose: () => closeTab(positionIndex), onUpdateX: handleUpdateX, shouldUpdateX: getUpdateX(), onDrag: handleDrag })))))));
};
//# sourceMappingURL=BrowserTabs.js.map