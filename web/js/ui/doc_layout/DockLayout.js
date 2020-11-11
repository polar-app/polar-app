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
exports.DockLayout = void 0;
const React = __importStar(require("react"));
const MousePositions_1 = require("./MousePositions");
const Tuples_1 = require("polar-shared/src/util/Tuples");
const Functions_1 = require("polar-shared/src/util/Functions");
const Debouncers_1 = require("polar-shared/src/util/Debouncers");
const DockSplitter_1 = require("./DockSplitter");
class Styles {
}
Styles.Dock = {
    display: 'flex',
    flexGrow: 1,
    minHeight: 0
};
class DockLayout extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.mousePosition = MousePositions_1.MousePositions.get();
        this.mouseDown = false;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.markResizing = this.markResizing.bind(this);
        const createFixedDocPanelStateMap = () => {
            const result = {};
            for (const docPanel of this.props.dockPanels) {
                if (docPanel.type === 'fixed') {
                    result[docPanel.id] = {
                        id: docPanel.id,
                        width: docPanel.width || 400
                    };
                }
            }
            return result;
        };
        this.state = {
            resizing: undefined,
            panels: createFixedDocPanelStateMap()
        };
    }
    render() {
        const createDockPanels = () => {
            const tuples = Tuples_1.Tuples.createSiblings(this.props.dockPanels.filter(current => !current.disabled));
            const result = [];
            const createBaseStyle = () => {
                const style = {
                    overflow: 'auto',
                };
                if (this.state.resizing) {
                    return Object.assign(Object.assign({}, style), { pointerEvents: 'none', userSelect: 'none' });
                }
                else {
                    return style;
                }
            };
            const createFixedDockPanelElement = (docPanel, idx) => {
                const panelState = this.state.panels[docPanel.id];
                const { width } = panelState;
                const baseStyle = createBaseStyle();
                const style = Object.assign(Object.assign(Object.assign({}, baseStyle), { width, maxWidth: width, minWidth: width }), (docPanel.style || {}));
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
                    const splitter = React.createElement(DockSplitter_1.DockSplitter, { key: 'splitter-' + tuple.idx, onMouseDown: () => this.onMouseDown(resizeTarget) });
                    result.push(splitter);
                }
            }
            return result;
        };
        const docPanels = createDockPanels();
        const handleMouseMove = Debouncers_1.Debouncers.create(() => this.onMouseMove());
        return (React.createElement("div", { className: "dock-layout", style: Object.assign({}, Styles.Dock), onMouseMove: () => handleMouseMove(), draggable: false }, docPanels));
    }
    onMouseUp() {
        this.mousePosition = MousePositions_1.MousePositions.get();
        this.markResizing(undefined);
    }
    onMouseDown(resizeTarget) {
        this.mousePosition = MousePositions_1.MousePositions.get();
        this.markResizing(resizeTarget);
        window.addEventListener('mouseup', () => {
            this.onMouseUp();
        }, { once: true });
    }
    markResizing(resizeTarget) {
        const toggleUserSelect = (resizing) => {
            if (resizing) {
                document.body.style.userSelect = 'none';
            }
            else {
                document.body.style.userSelect = 'auto';
            }
        };
        toggleUserSelect(resizeTarget !== undefined);
        this.mouseDown = resizeTarget !== undefined;
        this.setState(Object.assign(Object.assign({}, this.state), { resizing: resizeTarget }));
    }
    onMouseMove() {
        if (!this.mouseDown) {
            return;
        }
        const lastMousePosition = MousePositions_1.MousePositions.get();
        const resizeTarget = this.state.resizing;
        const mult = resizeTarget.direction === 'left' ? 1 : -1;
        const delta = mult * (lastMousePosition.clientX - this.mousePosition.clientX);
        const panelState = this.state.panels[resizeTarget.id];
        const width = panelState.width + delta;
        const newPanelState = Object.assign(Object.assign({}, panelState), { width });
        const newPanels = Object.assign({}, this.state.panels);
        newPanels[resizeTarget.id] = newPanelState;
        (this.props.onResize || Functions_1.NULL_FUNCTION)();
        this.setState(Object.assign(Object.assign({}, this.state), { panels: newPanels }));
        this.mousePosition = lastMousePosition;
    }
}
exports.DockLayout = DockLayout;
//# sourceMappingURL=DockLayout.js.map