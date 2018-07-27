"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
require("bootstrap");
require("bootstrap/js/src/util");
require("bootstrap/js/src/modal");
require("bootstrap/js/src/dropdown");
require("bootstrap/js/src/tooltip");
require('summernote/dist/summernote-bs4');
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const react_jsonschema_form_1 = require("react-jsonschema-form");
const { ReactSummernote } = require('react-summernote');
class InputController {
    createNewFlashcard(targetElement, formHandler) {
        const schema = {
            "title": "Flashcard",
            "description": "",
            "type": "object",
            "definitions": {
                "front": {
                    "title": "Front"
                },
            }
        };
        const uiSchema = {
            front: {
                "ui:widget": RichTextWidget,
            },
            back: {
                "ui:widget": RichTextWidget,
            }
        };
        if (!targetElement) {
            throw new Error("No schemaFormElement");
        }
        let onChangeCallback = () => function (data) { formHandler.onChange(data); };
        let onSubmitCallback = () => function (data) { formHandler.onSubmit(data); };
        let onErrorCallback = () => function (data) { formHandler.onError(data); };
        react_dom_1.render((react_1.default.createElement(react_jsonschema_form_1.default, { schema: schema, autocomplete: "off", uiSchema: uiSchema, onChange: onChangeCallback(), onSubmit: onSubmitCallback(), onError: onErrorCallback() })), targetElement);
    }
}
class RichTextEditor extends react_1.Component {
    constructor(props = {}) {
        super(props);
    }
    onChange(content) {
        console.log('this', this);
        console.log('onChange', content);
    }
    onImageUpload(images, insertImage) {
        console.log('onImageUpload', images);
        for (let i = 0; i < images.length; i++) {
            const reader = new FileReader();
            reader.onloadend = () => {
                insertImage(reader.result);
            };
            reader.readAsDataURL(images[i]);
        }
    }
    ;
    render() {
        return (react_1.default.createElement(ReactSummernote, { value: "", options: {
                lang: 'en-US',
                height: 150,
                dialogsInBody: true,
            }, onChange: this.onChange, onImageUpload: this.onImageUpload }));
    }
}
function RichTextWidget(props) {
    const { id, classNames, label, help, required, description, errors, children } = props;
    let onImageUpload = (images, insertImage) => {
        console.log('onImageUpload', images);
        for (let i = 0; i < images.length; i++) {
            const reader = new FileReader();
            reader.onloadend = () => {
                insertImage(reader.result);
            };
            reader.readAsDataURL(images[i]);
        }
    };
    return (react_1.default.createElement(ReactSummernote, { value: "", options: {
            lang: 'en-US',
            height: 150,
            dialogsInBody: true,
        }, onChange: (newValue) => props.onChange(newValue), onImageUpload: onImageUpload }));
}
module.exports.InputController = InputController;
//# sourceMappingURL=InputController.js.map