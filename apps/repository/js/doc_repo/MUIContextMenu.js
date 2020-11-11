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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIContextMenu = exports.useContextMenu = exports.createContextMenu = exports.computeEventOrigin = exports.ContextMenuContext = exports.MouseEvents = void 0;
const react_1 = __importStar(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const Menu_1 = __importDefault(require("@material-ui/core/Menu"));
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
var MouseEvents;
(function (MouseEvents) {
    function fromNativeEvent(event) {
        return {
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            target: event.target,
            nativeEvent: event,
            preventDefault: event.preventDefault.bind(event),
            stopPropagation: event.stopPropagation.bind(event),
            getModifierState: event.getModifierState.bind(event),
        };
    }
    MouseEvents.fromNativeEvent = fromNativeEvent;
})(MouseEvents = exports.MouseEvents || (exports.MouseEvents = {}));
exports.ContextMenuContext = react_1.default.createContext({ onContextMenu: Functions_1.NULL_FUNCTION });
function computeEventOrigin(event) {
    const origin = {
        pageX: event.pageX,
        pageY: event.pageY,
        clientX: event.clientX,
        clientY: event.clientY,
        offsetX: event.offsetX,
        offsetY: event.offsetY,
    };
    return origin;
}
exports.computeEventOrigin = computeEventOrigin;
function computeMenuPoint(event) {
    function computeOffsets() {
        if (event.nativeEvent.view && event.nativeEvent.view.frameElement) {
            const bcr = event.nativeEvent.view.frameElement.getBoundingClientRect();
            return {
                x: bcr.left,
                y: bcr.top
            };
        }
        return {
            x: 0,
            y: 0
        };
    }
    const offsets = computeOffsets();
    const buffer = {
        x: -2,
        y: -4
    };
    return {
        x: event.clientX + offsets.x + buffer.x,
        y: event.clientY + offsets.y + buffer.y
    };
}
function createContextMenu(MenuComponent, opts = {}) {
    return (props) => {
        const [active, setActive] = react_1.useState(undefined);
        const onContextMenu = react_1.default.useCallback((event) => {
            event.stopPropagation();
            event.preventDefault();
            const origin = opts.computeOrigin ? opts.computeOrigin(event) : undefined;
            const menuPoint = computeMenuPoint(event);
            const newActive = {
                mouseX: menuPoint.x,
                mouseY: menuPoint.y,
                origin
            };
            setActive(newActive);
        }, []);
        const handleClose = react_1.default.useCallback(() => {
            setActive(undefined);
        }, []);
        return (react_1.default.createElement(exports.ContextMenuContext.Provider, { value: { onContextMenu } },
            active &&
                react_1.default.createElement(exports.MUIContextMenu, Object.assign({}, active, { anchorEl: props.anchorEl, handleClose: handleClose }),
                    react_1.default.createElement(MenuComponent, { origin: active.origin })),
            props.children));
    };
}
exports.createContextMenu = createContextMenu;
function useContextMenu(opts = {}) {
    const contextMenuCallbacks = react_1.default.useContext(exports.ContextMenuContext);
    const onContextMenu = react_1.default.useCallback((event) => {
        const parent = opts.onContextMenu || Functions_1.NULL_FUNCTION;
        parent(event);
        contextMenuCallbacks.onContextMenu(event);
    }, [contextMenuCallbacks, opts]);
    return { onContextMenu };
}
exports.useContextMenu = useContextMenu;
exports.MUIContextMenu = ReactUtils_1.deepMemo((props) => {
    const handleClose = react_1.default.useCallback(() => {
        props.handleClose();
    }, [props]);
    function handleContextMenu(event) {
        event.preventDefault();
    }
    return (react_1.default.createElement(Menu_1.default, { transitionDuration: 50, keepMounted: true, anchorEl: props.anchorEl, open: true, onClose: handleClose, onClick: handleClose, onContextMenu: handleContextMenu, anchorReference: "anchorPosition", anchorPosition: {
            top: props.mouseY,
            left: props.mouseX
        } },
        react_1.default.createElement("div", null, props.children)));
});
//# sourceMappingURL=MUIContextMenu.js.map