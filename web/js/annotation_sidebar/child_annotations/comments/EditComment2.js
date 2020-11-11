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
exports.EditComment2 = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const RichTextArea_1 = require("../../RichTextArea");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const MUIButtonBar_1 = require("../../../mui/MUIButtonBar");
const ReactUtils_1 = require("../../../react/ReactUtils");
const InputCompleteListener_1 = require("../../../mui/complete_listeners/InputCompleteListener");
const CancelButton_1 = require("../CancelButton");
exports.EditComment2 = ReactUtils_1.deepMemo((props) => {
    var _a;
    const htmlRef = react_1.useRef(((_a = props.existingComment) === null || _a === void 0 ? void 0 : _a.content.HTML) || "");
    const onComplete = React.useCallback(() => {
        props.onComment(htmlRef.current);
    }, [props]);
    const id = 'rich-text-editor-' + props.id;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "annotation-comment-box", className: "m-1" },
            React.createElement(InputCompleteListener_1.InputCompleteListener, { type: 'meta+enter', onComplete: onComplete, onCancel: props.onCancel },
                React.createElement(RichTextArea_1.RichTextArea, { id: id, value: htmlRef.current, autofocus: true, onChange: (html) => htmlRef.current = html })),
            React.createElement("div", { className: "pt-1 pb-1" },
                React.createElement(MUIButtonBar_1.MUIButtonBar, { style: {
                        flexGrow: 1,
                        justifyContent: "flex-end"
                    } },
                    React.createElement(CancelButton_1.CancelButton, { onClick: props.onCancel }),
                    React.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: onComplete }, props.existingComment ? 'Update' : 'Comment'))))));
});
//# sourceMappingURL=EditComment2.js.map