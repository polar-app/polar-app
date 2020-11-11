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
exports.MUIDocButtonBar = void 0;
const react_1 = __importStar(require("react"));
const DocRepoStore2_1 = require("./DocRepoStore2");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const MUIDocTagButton_1 = require("./buttons/MUIDocTagButton");
const MUIDocArchiveButton_1 = require("./buttons/MUIDocArchiveButton");
const MUIDocFlagButton_1 = require("./buttons/MUIDocFlagButton");
function useSelectRowCallback(id, delegate) {
    const callbacks = DocRepoStore2_1.useDocRepoCallbacks();
    return react_1.useCallback((event) => {
        callbacks.selectRow(id, event, 'click');
        delegate();
    }, [callbacks, id, delegate]);
}
exports.MUIDocButtonBar = react_1.default.memo((props) => {
    const callbacks = DocRepoStore2_1.useDocRepoCallbacks();
    const { viewID } = props;
    const onTagged = useSelectRowCallback(viewID, callbacks.onTagged);
    const onArchived = useSelectRowCallback(viewID, callbacks.onArchived);
    const onFlagged = useSelectRowCallback(viewID, callbacks.onFlagged);
    return (react_1.default.createElement("div", { className: props.className || '', onClick: () => callbacks.setSelected([viewID]) },
        react_1.default.createElement(MUIDocTagButton_1.MUIDocTagButton, { onClick: onTagged }),
        react_1.default.createElement(MUIDocArchiveButton_1.MUIDocArchiveButton, { onClick: onArchived, active: props.archived }),
        react_1.default.createElement(MUIDocFlagButton_1.MUIDocFlagButton, { onClick: onFlagged, active: props.flagged })));
}, react_fast_compare_1.default);
//# sourceMappingURL=MUIDocButtonBar.js.map