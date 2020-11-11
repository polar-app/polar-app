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
exports.DockLayoutManager = void 0;
const React = __importStar(require("react"));
const MousePositions_1 = require("./MousePositions");
const Tuples_1 = require("polar-shared/src/util/Tuples");
const Functions_1 = require("polar-shared/src/util/Functions");
const Debouncers_1 = require("polar-shared/src/util/Debouncers");
const DockSplitter_1 = require("./DockSplitter");
const ReactUtils_1 = require("../../react/ReactUtils");
const ReactHooks_1 = require("../../hooks/ReactHooks");
const DockLayoutStore_1 = require("./DockLayoutStore");
class Styles {
}
Styles.Dock = {
    display: 'flex',
    flexGrow: 1,
    minHeight: 0
};
exports.DockLayoutManager = ReactUtils_1.deepMemo((props) => {
    const mousePosition = React.useRef(MousePositions_1.MousePositions.get());
    const mouseDown = React.useRef(false);
    const { panels } = DockLayoutStore_1.useDockLayoutStore(['panels']);
    const { setPanels } = DockLayoutStore_1.useDockLayoutCallbacks();
    const [, setState, stateRef] = ReactHooks_1.useRefState({
        resizing: undefined,
    });
    const markResizing = React.useCallback((resizeTarget) => {
        const toggleUserSelect = (resizing) => {
            if (resizing) {
                document.body.style.userSelect = 'none';
            }
            else {
                document.body.style.userSelect = 'auto';
            }
        };
        toggleUserSelect(resizeTarget !== undefined);
        mouseDown.current = resizeTarget !== undefined;
        setState(Object.assign(Object.assign({}, stateRef.current), { resizing: resizeTarget }));
    }, [setState, stateRef]);
    const onMouseUp = React.useCallback(() => {
        mousePosition.current = MousePositions_1.MousePositions.get();
        markResizing(undefined);
    }, [markResizing]);
    const onMouseDown = React.useCallback((resizeTarget) => {
        mousePosition.current = MousePositions_1.MousePositions.get();
        markResizing(resizeTarget);
        window.addEventListener('mouseup', () => {
            onMouseUp();
        }, { once: true });
    }, [markResizing, onMouseUp]);
    const onMouseMove = React.useCallback(() => {
        if (!mouseDown.current) {
            return;
        }
        const lastMousePosition = MousePositions_1.MousePositions.get();
        const resizeTarget = stateRef.current.resizing;
        const mult = resizeTarget.direction === 'left' ? 1 : -1;
        const delta = mult * (lastMousePosition.clientX - mousePosition.current.clientX);
        const panelState = panels[resizeTarget.id];
        const width = panelState.width + delta;
        const newPanelState = Object.assign(Object.assign({}, panelState), { width });
        const newPanels = Object.assign({}, panels);
        newPanels[resizeTarget.id] = newPanelState;
        (props.onResize || Functions_1.NULL_FUNCTION)();
        setPanels(newPanels);
        mousePosition.current = lastMousePosition;
    }, [stateRef, panels, props.onResize, setPanels]);
    const handleMouseMove = React.useMemo(() => Debouncers_1.Debouncers.create(() => onMouseMove()), [onMouseMove]);
    const createDockPanels = React.useCallback(() => {
        const tuples = Tuples_1.Tuples.createSiblings(props.dockPanels.filter(current => !current.disabled));
        const result = [];
        const createBaseStyle = () => {
            const style = {
                overflow: 'auto',
            };
            if (stateRef.current.resizing) {
                return Object.assign(Object.assign({}, style), { pointerEvents: 'none', userSelect: 'none' });
            }
            else {
                return style;
            }
        };
        const createFixedDockPanelElement = (docPanel, idx) => {
            const panel = panels[docPanel.id];
            const width = panel.collapsed ? 0 : panel.width;
            const baseStyle = createBaseStyle();
            const docPanelStyle = (docPanel.style || {});
            const display = panel.collapsed ? 'none' : (baseStyle.display || docPanelStyle.display || 'block');
            const style = Object.assign(Object.assign(Object.assign(Object.assign({}, baseStyle), { width, maxWidth: width, minWidth: width }), docPanelStyle), { display });
            return (React.createElement("div", { className: "dock-layout-fixed", style: style, key: idx, id: docPanel.id }, docPanel.component));
        };
        const createGrowDockPanelElement = (docPanel, idx) => {
            const style = Object.assign(Object.assign(Object.assign({}, createBaseStyle()), { flexGrow: docPanel.grow || 1 }), (docPanel.style || {}));
            return (React.createElement("div", { className: "dock-layout-grow", style: style, key: idx, id: docPanel.id }, docPanel.component));
        };
        const createDocPanelElement = (docPanel, idx) => {
            if (docPanel.type === 'fixed') {
                return createFixedDockPanelElement(docPanel, idx);
            }
            return createGrowDockPanelElement(docPanel, idx);
        };
        for (const tuple of tuples) {
            result.push(createDocPanelElement(tuple.curr, tuple.idx));
            const computeResizeTarget = () => {
                if (tuple.curr.type === 'fixed') {
                    return {
                        id: tuple.curr.id,
                        direction: 'left'
                    };
                }
                return {
                    id: tuple.next.id,
                    direction: 'right'
                };
            };
            if (tuple.next !== undefined) {
                const resizeTarget = computeResizeTarget();
                const splitter = React.createElement(DockSplitter_1.DockSplitter, { key: 'splitter-' + tuple.idx, onMouseDown: () => onMouseDown(resizeTarget) });
                result.push(splitter);
            }
        }
        return result;
    }, [onMouseDown, panels, props.dockPanels, stateRef]);
    const docPanels = createDockPanels();
    return (React.createElement("div", { className: "dock-layout", style: Object.assign({}, Styles.Dock), onMouseMove: () => handleMouseMove(), draggable: false }, docPanels));
});
//# sourceMappingURL=DockLayoutManager.js.map