"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
global.$ = global.jQuery = require("jquery");
require("bootstrap/dist/js/bootstrap.bundle.js");
const react_1 = __importDefault(require("react"));
const react_dom_1 = require("react-dom");
const react_jsonschema_form_1 = __importDefault(require("react-jsonschema-form"));
const SchemaUIFactory_1 = require("./SchemaUIFactory");
require('summernote/dist/summernote-bs4');
const { SchemaFactory } = require("./SchemaFactory");
if (!react_1.default) {
    console.warn("FIXME: react: ", react_1.default);
    throw new Error("React is null!");
}
class InputController {
    createNewFlashcard(targetElement, formHandler) {
        let schema = SchemaFactory.create();
        let schemaUI = SchemaUIFactory_1.SchemaUIFactory.create();
        if (!targetElement) {
            throw new Error("No schemaFormElement");
        }
        if (!schema) {
            throw new Error("No schema");
        }
        if (!formHandler) {
            throw new Error("No formHandler");
        }
        let onChangeCallback = () => function (data) { formHandler.onChange(data); };
        let onSubmitCallback = () => function (data) { formHandler.onSubmit(data); };
        let onErrorCallback = () => function (data) { formHandler.onError(data); };
        react_dom_1.render((react_1.default.createElement(react_jsonschema_form_1.default, { schema: schema, autocomplete: "off", uiSchema: schemaUI, onChange: onChangeCallback(), onSubmit: onSubmitCallback(), onError: onErrorCallback() })), targetElement);
    }
}
exports.InputController = InputController;
//# sourceMappingURL=InputController.js.map