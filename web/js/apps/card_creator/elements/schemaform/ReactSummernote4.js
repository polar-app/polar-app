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
exports.ReactSummernote4 = void 0;
const JQuery_1 = __importDefault(require("../../../../ui/JQuery"));
require("summernote/dist/summernote-lite");
require("summernote/dist/summernote-lite.css");
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const HTMLSanitizer_1 = require("polar-html/src/sanitize/HTMLSanitizer");
const randomUid = () => Math.floor(Math.random() * 100000);
class ReactSummernote4 extends react_1.Component {
    constructor(props) {
        super(props);
        if (this.props.options.id) {
            this.uid = this.props.options.id;
        }
        else {
            this.uid = `react-summernote-${randomUid()}`;
        }
        this.editor = {};
        this.noteEditable = null;
        this.notePlaceholder = null;
        this.onInit = this.onInit.bind(this);
        this.onImageUpload = this.onImageUpload.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.focus = this.focus.bind(this);
        this.isEmpty = this.isEmpty.bind(this);
        this.reset = this.reset.bind(this);
        this.replace = this.replace.bind(this);
        this.disable = this.disable.bind(this);
        this.enable = this.enable.bind(this);
        this.toggleState = this.toggleState.bind(this);
        this.insertImage = this.insertImage.bind(this);
        this.insertNode = this.insertNode.bind(this);
        this.insertText = this.insertText.bind(this);
        if (this.props.onRichTextMutator) {
            this.props.onRichTextMutator(this);
        }
    }
    componentDidMount() {
        const options = this.props.options || {};
        const codeview = this.props.codeview;
        options.callbacks = this.callbacks;
        const domNode = react_dom_1.default.findDOMNode(this);
        this.editor = JQuery_1.default(domNode).find(`#${this.uid}`);
        this.editor.summernote(options);
        if (codeview) {
            this.editor.summernote('codeview.activate');
        }
        if (options.airMode) {
            domNode.parentElement.addEventListener('click', () => {
                this.editor.summernote('focus');
            });
        }
        if (this.props.autofocus) {
            this.editor.summernote('focus');
        }
    }
    componentWillReceiveProps(nextProps) {
        const { props } = this;
        const codeview = nextProps.codeview;
        const codeviewCommand = codeview ? 'codeview.activate' : 'codeview.deactivate';
        if (typeof nextProps.value === 'string') {
            this.replace(nextProps.value);
        }
        if (typeof nextProps.disabled === 'boolean' && props.disabled !== nextProps.disabled) {
            this.toggleState(nextProps.disabled);
        }
        if (codeview !== props.codeview) {
            this.editor.summernote(codeviewCommand);
        }
        if (this.props.autofocus) {
            this.editor.summernote('focus');
        }
    }
    shouldComponentUpdate() {
        return false;
    }
    componentWillUnmount() {
        if (this.editor.summernote) {
            this.editor.summernote('destroy');
        }
    }
    onInit() {
        const { disabled, onInit } = this.props;
        const $container = this.editor.parent();
        this.noteEditable = $container.find('.note-editable');
        this.notePlaceholder = $container.find('.note-placeholder');
        if (typeof disabled === 'boolean') {
            this.toggleState(disabled);
        }
        if (typeof onInit === 'function') {
            onInit({
                summernote: this.editor.summernote.bind(this.editor),
                focus: this.focus,
                isEmpty: this.isEmpty,
                reset: this.reset,
                replace: this.replace,
                disable: this.disable,
                enable: this.enable,
                insertImage: this.insertImage,
                insertNode: this.insertNode,
                insertText: this.insertText
            });
        }
    }
    onImageUpload(images) {
        const { onImageUpload } = this.props;
        if (typeof onImageUpload === 'function') {
            onImageUpload(images, this.insertImage);
        }
    }
    onPaste(event) {
        const originalEvent = event.originalEvent;
        if (!originalEvent.clipboardData) {
            return;
        }
        if (originalEvent.clipboardData.types.includes('text/html')) {
            const srcHTML = originalEvent.clipboardData.getData('text/html');
            const sanitizedHTML = HTMLSanitizer_1.HTMLSanitizer.sanitizePasteData(srcHTML);
            const spanElement = document.createElement('span');
            spanElement.innerHTML = sanitizedHTML;
            this.insertNode(spanElement);
            originalEvent.preventDefault();
            originalEvent.stopPropagation();
        }
    }
    focus() {
        this.editor.summernote('focus');
    }
    isEmpty() {
        return this.editor.summernote('isEmpty');
    }
    reset() {
        this.editor.summernote('reset');
    }
    replace(content) {
        const { noteEditable, notePlaceholder } = this;
        const prevContent = noteEditable.html();
        const contentLength = content.length;
        if (prevContent !== content) {
            if (this.isEmpty() && contentLength > 0) {
                notePlaceholder.hide();
            }
            else if (contentLength === 0) {
                notePlaceholder.show();
            }
            noteEditable.html(content);
            this.focus();
        }
    }
    currentValue() {
        return this.noteEditable.html();
    }
    createRange() {
        return this.editor.summernote('createRange');
    }
    disable() {
        this.editor.summernote('disable');
    }
    enable() {
        this.editor.summernote('enable');
    }
    toggleState(disabled) {
        if (disabled) {
            this.disable();
        }
        else {
            this.enable();
        }
    }
    insertImage(url, filenameOrCallback) {
        this.editor.summernote('insertImage', url, filenameOrCallback);
        this.focus();
    }
    insertNode(node) {
        this.editor.summernote('insertNode', node);
    }
    insertText(text) {
        this.editor.summernote('insertText', text);
        this.focus();
    }
    saveRange() {
        this.editor.summernote('saveRange');
    }
    restoreRange() {
        this.editor.summernote('restoreRange');
    }
    get callbacks() {
        const props = this.props;
        return {
            onInit: this.onInit,
            onEnter: props.onEnter,
            onFocus: props.onFocus,
            onBlur: props.onBlur,
            onKeyup: props.onKeyUp,
            onKeydown: props.onKeyDown,
            onPaste: props.onPaste || this.onPaste,
            onChange: props.onChange,
            onImageUpload: this.onImageUpload
        };
    }
    render() {
        const { value, defaultValue, className } = this.props;
        const html = value || defaultValue || "";
        return (react_1.default.createElement("div", { className: className, style: { fontSize: '14px' } },
            react_1.default.createElement("div", { id: this.uid, dangerouslySetInnerHTML: { __html: html } })));
    }
}
exports.ReactSummernote4 = ReactSummernote4;
//# sourceMappingURL=ReactSummernote4.js.map