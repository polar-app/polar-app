"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIThemeTypeContext = void 0;
const react_1 = __importDefault(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
exports.MUIThemeTypeContext = react_1.default.createContext({
    theme: 'light',
    setTheme: Functions_1.NULL_FUNCTION
});
//# sourceMappingURL=MUIThemeTypeContext.js.map