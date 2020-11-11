"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorScreen = void 0;
const react_1 = __importDefault(require("react"));
exports.ErrorScreen = () => {
    if (true === true) {
        throw new Error("This is an error");
    }
    return (react_1.default.createElement("div", null, "this should fail"));
};
//# sourceMappingURL=ErrorScreen.js.map