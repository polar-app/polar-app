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
exports.EditableContent = void 0;
const React = __importStar(require("react"));
const CKEditor5_1 = require("./CKEditor5");
const ClickAwayListener_1 = __importDefault(require("@material-ui/core/ClickAwayListener"));
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
exports.EditableContent = ReactUtils_1.deepMemo((props) => {
    const [editing, setEditing] = React.useState(false);
    const [content, setContent] = React.useState(props.content);
    const handleChange = React.useCallback((content) => {
        setContent(content);
        props.onChange(content);
    }, [props]);
    const handleKeyDown = React.useCallback((event) => {
        console.log("FIXME: handling key down");
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            console.log("FIXME: finished");
            setEditing(false);
        }
    }, []);
    if (editing) {
        return (React.createElement(ClickAwayListener_1.default, { onClickAway: () => setEditing((false)) },
            React.createElement("div", { onKeyDown: handleKeyDown },
                React.createElement(CKEditor5_1.CKEditor5, { content: content, onChange: handleChange }))));
    }
    else {
        return (React.createElement("p", { onClick: () => setEditing(true), dangerouslySetInnerHTML: { __html: content } }));
    }
});
//# sourceMappingURL=EditableContent.js.map