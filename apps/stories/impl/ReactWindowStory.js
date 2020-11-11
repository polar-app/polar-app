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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactWindowStory = void 0;
const React = __importStar(require("react"));
const react_window_1 = require("react-window");
const DockLayout2_1 = require("../../../web/js/ui/doc_layout/DockLayout2");
const CaptureSizeContainer_1 = require("../../../web/js/react/CaptureSizeContainer");
const DockLayoutStore_1 = require("../../../web/js/ui/doc_layout/DockLayoutStore");
const WindowHooks_1 = require("../../../web/js/react/WindowHooks");
const rowHeights = new Array(1000)
    .fill(true)
    .map(() => 25 + Math.round(Math.random() * 50));
const getItemSize = (index) => rowHeights[index];
const Row = (props) => (React.createElement("div", { style: props.style },
    "Row ",
    props.index));
const ReactWindowList = () => {
    const dimensions = useWindowListContainerDimensions();
    return (React.createElement(react_window_1.VariableSizeList, { height: dimensions.height, itemCount: 1000, itemSize: getItemSize, width: dimensions.width }, Row));
};
function useWindowResizeDimensions() {
    const calculateDimensions = React.useCallback(() => {
        return {
            width: window.outerWidth,
            height: window.outerHeight
        };
    }, []);
    const [state, setState] = React.useState(() => calculateDimensions());
    WindowHooks_1.useWindowResizeEventListener(() => setState(calculateDimensions()));
    return state;
}
function useWindowListContainerDimensions() {
    const calculator = CaptureSizeContainer_1.useCaptureSizeCalculator();
    DockLayoutStore_1.useDockLayoutResized();
    useWindowResizeDimensions();
    return calculator();
}
const DebugContainerSize = () => {
    const dimensions = useWindowListContainerDimensions();
    return (React.createElement("div", { style: {
            position: 'absolute',
            bottom: '10px',
            right: '10px'
        } },
        dimensions.width,
        "x",
        dimensions.height));
};
const WindowListSidebar = () => {
    return (React.createElement(CaptureSizeContainer_1.CaptureSizeContainer, { style: { flexGrow: 1 } },
        React.createElement(React.Fragment, null,
            React.createElement(ReactWindowList, null),
            React.createElement(DebugContainerSize, null))));
};
exports.ReactWindowStory = () => (React.createElement(DockLayout2_1.DockLayout2, { dockPanels: [
        {
            id: "doc-panel-outline",
            type: 'fixed',
            side: 'left',
            style: {
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                flexGrow: 1
            },
            component: (React.createElement(WindowListSidebar, null)),
            width: 410,
        },
        {
            id: "dock-panel-viewer",
            type: 'grow',
            style: {
                display: 'flex'
            },
            component: (React.createElement("div", null, "this is just an example"))
        }
    ] }));
//# sourceMappingURL=ReactWindowStory.js.map