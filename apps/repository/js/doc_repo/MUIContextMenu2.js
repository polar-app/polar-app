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
exports.MUIContextMenu = exports.createContextMenu = exports.computeEventOrigin = exports.ContextMenuContext = exports.MouseEvents = void 0;
const React = __importStar(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const Menu_1 = __importDefault(require("@material-ui/core/Menu"));
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const MUIContextMenuStore_1 = require("./MUIContextMenuStore");
const ReactHooks_1 = require("../../../../web/js/hooks/ReactHooks");
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
exports.ContextMenuContext = React.createContext({ computeOrigin: Functions_1.NULL_FUNCTION });
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
    const [MUIContextMenuStoreProvider, useMUIContextMenuStore, useMUIContextMenuCallbacks, useMUIContextMenuMutator] = MUIContextMenuStore_1.createContextMenuStore();
    const useContextMenu = (opts = {}) => {
        const { setActive } = useMUIContextMenuCallbacks();
        const { computeOrigin } = React.useContext(exports.ContextMenuContext);
        const onContextMenu = React.useCallback((event) => {
            const parent = opts.onContextMenu || Functions_1.NULL_FUNCTION;
            parent(event);
            event.stopPropagation();
            event.preventDefault();
            const origin = computeOrigin ? computeOrigin(event) : undefined;
            const menuPoint = computeMenuPoint(event);
            const newActive = {
                mouseX: menuPoint.x,
                mouseY: menuPoint.y,
                origin
            };
            setActive(newActive);
        }, [computeOrigin, opts.onContextMenu, setActive]);
        return { onContextMenu };
    };
    const ContextMenuInner = ReactHooks_1.typedMemo(function (props) {
        const { MenuComponent } = props;
        const { active } = useMUIContextMenuStore(['active']);
        const { setActive } = useMUIContextMenuCallbacks();
        const handleClose = React.useCallback(() => {
            setActive(undefined);
        }, [setActive]);
        return (React.createElement(React.Fragment, null, active &&
            React.createElement(exports.MUIContextMenu, Object.assign({}, active, { anchorEl: props.anchorEl, handleClose: handleClose }),
                React.createElement(MenuComponent, { origin: active.origin }))));
    });
    const ProviderComponent = (props) => {
        return (React.createElement(exports.ContextMenuContext.Provider, { value: { computeOrigin: opts.computeOrigin } },
            React.createElement(MUIContextMenuStoreProvider, null,
                React.createElement(React.Fragment, null,
                    React.createElement(ContextMenuInner, { MenuComponent: MenuComponent, anchorEl: props.anchorEl }),
                    props.children))));
    };
    return [ProviderComponent, useContextMenu];
}
exports.createContextMenu = createContextMenu;
exports.MUIContextMenu = ReactUtils_1.deepMemo((props) => {
    const handleClose = React.useCallback(() => {
        props.handleClose();
    }, [props]);
    const handleContextMenu = React.useCallback((event) => {
        event.preventDefault();
    }, []);
    return (React.createElement(Menu_1.default, { transitionDuration: 50, keepMounted: true, anchorEl: props.anchorEl, open: true, onClose: handleClose, onClick: handleClose, onContextMenu: handleContextMenu, anchorReference: "anchorPosition", anchorPosition: {
            top: props.mouseY,
            left: props.mouseX
        } },
        React.createElement("div", null, props.children)));
});
//# sourceMappingURL=MUIContextMenu2.js.map