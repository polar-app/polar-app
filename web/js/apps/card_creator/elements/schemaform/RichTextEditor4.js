"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichTextEditor4 = void 0;
const react_1 = __importDefault(require("react"));
const TypedWidgetProps_1 = require("./TypedWidgetProps");
const Logger_1 = require("polar-shared/src/logger/Logger");
const ReactSummernote4_1 = require("./ReactSummernote4");
const Functions_1 = require("polar-shared/src/util/Functions");
const log = Logger_1.Logger.create();
class RichTextEditor4 extends react_1.default.Component {
    constructor(props) {
        super(props);
        if (props.id) {
            this.id = props.id;
        }
        else {
            throw new Error("No ID");
        }
        this.onChange = this.onChange.bind(this);
        this.onImageUpload = this.onImageUpload.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.typedWidgetProps = new TypedWidgetProps_1.TypedWidgetProps(props);
        this.state = {
            value: this.typedWidgetProps.value || ''
        };
    }
    onChange(newValue) {
        this.setState({ value: newValue });
        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
    }
    onBlur() {
        if (this.props.onBlur) {
            this.props.onBlur(this.id, this.state.value);
        }
    }
    onFocus() {
        if (this.props.onFocus) {
            this.props.onFocus(this.id, this.state.value);
        }
    }
    onImageUpload(images, insertImage) {
        log.debug('onImageUpload', images);
        for (const image of images) {
            const reader = new FileReader();
            reader.onloadend = () => {
                insertImage(reader.result);
            };
            reader.readAsDataURL(image);
        }
    }
    render() {
        const onKeyDown = this.props.onKeyDown ? this.props.onKeyDown : Functions_1.NULL_FUNCTION;
        return (react_1.default.createElement(ReactSummernote4_1.ReactSummernote4, { value: this.state.value, defaultValue: this.props.defaultValue, options: {
                id: this.typedWidgetProps.id,
                lang: 'en-US',
                height: 180,
                disableResizeEditor: true,
                placeholder: this.props.placeholder || '',
                dialogsInBody: false,
                airMode: false,
                tabSize: 0,
                keyMap: {
                    pc: {
                        'ESC': 'escape',
                        'ENTER': 'insertParagraph',
                        'CTRL+Z': 'undo',
                        'CTRL+Y': 'redo',
                        'TAB': 'tab',
                        'SHIFT+TAB': 'untab',
                        'CTRL+B': 'bold',
                        'CTRL+I': 'italic',
                        'CTRL+U': 'underline',
                        'CTRL+SHIFT+S': 'strikethrough',
                        'CTRL+BACKSLASH': 'removeFormat',
                        'CTRL+SHIFT+L': 'justifyLeft',
                        'CTRL+SHIFT+E': 'justifyCenter',
                        'CTRL+SHIFT+R': 'justifyRight',
                        'CTRL+SHIFT+J': 'justifyFull',
                        'CTRL+SHIFT+NUM7': 'insertUnorderedList',
                        'CTRL+SHIFT+NUM8': 'insertOrderedList',
                        'CTRL+LEFTBRACKET': 'outdent',
                        'CTRL+RIGHTBRACKET': 'indent',
                        'CTRL+NUM0': 'formatPara',
                        'CTRL+NUM1': 'formatH1',
                        'CTRL+NUM2': 'formatH2',
                        'CTRL+NUM3': 'formatH3',
                        'CTRL+NUM4': 'formatH4',
                        'CTRL+NUM5': 'formatH5',
                        'CTRL+NUM6': 'formatH6',
                        'CTRL+K': 'linkDialog.show',
                    },
                    mac: {
                        'ESC': 'escape',
                        'ENTER': 'insertParagraph',
                        'CMD+Z': 'undo',
                        'CMD+SHIFT+Z': 'redo',
                        'TAB': 'tab',
                        'SHIFT+TAB': 'untab',
                        'CMD+B': 'bold',
                        'CMD+I': 'italic',
                        'CMD+U': 'underline',
                        'CMD+SHIFT+S': 'strikethrough',
                        'CMD+BACKSLASH': 'removeFormat',
                        'CMD+SHIFT+L': 'justifyLeft',
                        'CMD+SHIFT+E': 'justifyCenter',
                        'CMD+SHIFT+R': 'justifyRight',
                        'CMD+SHIFT+J': 'justifyFull',
                        'CMD+SHIFT+NUM7': 'insertUnorderedList',
                        'CMD+SHIFT+NUM8': 'insertOrderedList',
                        'CMD+LEFTBRACKET': 'outdent',
                        'CMD+RIGHTBRACKET': 'indent',
                        'CMD+NUM0': 'formatPara',
                        'CMD+NUM1': 'formatH1',
                        'CMD+NUM2': 'formatH2',
                        'CMD+NUM3': 'formatH3',
                        'CMD+NUM4': 'formatH4',
                        'CMD+NUM5': 'formatH5',
                        'CMD+NUM6': 'formatH6',
                        'CMD+K': 'linkDialog.show',
                    },
                },
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline']],
                    ['para', ['paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture']],
                    ['view', []]
                ]
            }, autofocus: this.props.autofocus, onChange: this.onChange, onKeyDown: (event) => onKeyDown(event.originalEvent), onBlur: this.onBlur, onFocus: this.onFocus, onImageUpload: this.onImageUpload, onRichTextMutator: this.props.onRichTextMutator }));
    }
}
exports.RichTextEditor4 = RichTextEditor4;
//# sourceMappingURL=RichTextEditor4.js.map