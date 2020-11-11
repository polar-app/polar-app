"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRenderer = exports.MUIHoverContextDemo = void 0;
const react_1 = __importDefault(require("react"));
const MUIHoverContext_1 = require("./MUIHoverContext");
const ListeningComponent = () => (react_1.default.createElement(MUIHoverContext_1.MUIHoverListener, null,
    react_1.default.createElement("div", null, "this is the component that is supposed to toggle")));
exports.MUIHoverContextDemo = () => (react_1.default.createElement(MUIHoverContext_1.MUIHoverController, null,
    react_1.default.createElement("div", null,
        "this should be the main root component",
        react_1.default.createElement("p", null, "this is jsut another part of the component"),
        react_1.default.createElement(ListeningComponent, null))));
const Foo = (value) => (react_1.default.createElement("div", null, "foo"));
exports.TestRenderer = () => (react_1.default.createElement(MUIHoverContext_1.MUIHoverTypeContext.Consumer, null, Foo));
//# sourceMappingURL=MUIHoverContextDemo.js.map