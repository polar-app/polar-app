"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUBIFrameWindowEventListener = void 0;
const react_1 = __importDefault(require("react"));
const MUIContextMenu_1 = require("../../../../../repository/js/doc_repo/MUIContextMenu");
const EPUBIFrameHooks_1 = require("./EPUBIFrameHooks");
exports.EPUBIFrameWindowEventListener = () => {
    const { onContextMenu } = MUIContextMenu_1.useContextMenu();
    const iframe = EPUBIFrameHooks_1.useDocViewerIFrame();
    const unsubscriber = react_1.default.useRef(undefined);
    const handleContextMenu = react_1.default.useCallback((event) => {
        onContextMenu(MUIContextMenu_1.MouseEvents.fromNativeEvent(event));
    }, [onContextMenu]);
    react_1.default.useEffect(() => {
        var _a;
        if (unsubscriber.current) {
            unsubscriber.current();
        }
        if (!iframe) {
            console.warn("No iframe");
            return;
        }
        const source = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document.body;
        if (!source) {
            console.warn("No window for iframe");
            return;
        }
        source.addEventListener('contextmenu', handleContextMenu);
        unsubscriber.current = () => source.removeEventListener('contextmenu', handleContextMenu);
    });
    return null;
};
//# sourceMappingURL=EPUBIFrameWindowEventListener.js.map