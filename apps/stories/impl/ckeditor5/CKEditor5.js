"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CKEditor5 = void 0;
const ckeditor5_react_1 = __importDefault(require("@ckeditor/ckeditor5-react"));
const ckeditor5_build_balloon_1 = __importDefault(require("@ckeditor/ckeditor5-build-balloon"));
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
exports.CKEditor5 = ReactUtils_1.deepMemo((props) => {
    return (react_1.default.createElement(ckeditor5_react_1.default, { editor: ckeditor5_build_balloon_1.default, data: props.content, onInit: (editor) => {
            console.log('Editor is ready to use!', editor);
        }, onChange: (event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
            props.onChange(data);
        }, onBlur: (event, editor) => {
            console.log('Blur.', editor);
        }, onFocus: (event, editor) => {
            console.log('Focus.', editor);
        } }));
});
//# sourceMappingURL=CKEditor5.js.map