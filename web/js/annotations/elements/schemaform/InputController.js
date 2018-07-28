"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
global.$ = global.jQuery = require("jquery");
require("bootstrap/dist/js/bootstrap.bundle.js");
const React = require("react");
const react_dom_1 = require("react-dom");
const react_jsonschema_form_1 = require("react-jsonschema-form");
require('summernote/dist/summernote-bs4');
const { SchemaFactory } = require("./SchemaFactory");
if (!React) {
    throw new Error("React is null!");
}
class InputController {
    createNewFlashcard(targetElement, formHandler) {
        let schema = SchemaFactory.create();
        if (!targetElement) {
            throw new Error("No schemaFormElement");
        }
        if (!schema) {
            throw new Error("No schema");
        }
        if (!formHandler) {
            throw new Error("No formHandler");
        }
        const uiSchema = {};
        let onChangeCallback = () => function (data) { formHandler.onChange(data); };
        let onSubmitCallback = () => function (data) { formHandler.onSubmit(data); };
        let onErrorCallback = () => function (data) { formHandler.onError(data); };
        react_dom_1.render((React.createElement(react_jsonschema_form_1.default, { schema: schema, autocomplete: "off", uiSchema: uiSchema, onChange: onChangeCallback(), onSubmit: onSubmitCallback(), onError: onErrorCallback() })), targetElement);
    }
}
exports.InputController = InputController;
//# sourceMappingURL=InputController.js.map