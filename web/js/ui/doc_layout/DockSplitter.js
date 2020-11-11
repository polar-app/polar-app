"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockSplitter = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../../react/ReactUtils");
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
exports.DockSplitter = ReactUtils_1.deepMemo((props) => {
    const theme = useTheme_1.default();
    const [active, setActive] = react_1.default.useState(false);
    const createSplitterStyle = react_1.default.useCallback(() => {
        const result = {
            width: '4px',
            minWidth: '4px',
            maxWidth: '4px',
            cursor: 'col-resize',
            backgroundColor: theme.palette.divider,
            minHeight: 0
        };
        return result;
    }, [theme.palette.divider]);
    const splitterStyle = createSplitterStyle();
    return (react_1.default.createElement("div", { draggable: false, onMouseDown: () => props.onMouseDown(), style: splitterStyle }));
});
//# sourceMappingURL=DockSplitter.js.map