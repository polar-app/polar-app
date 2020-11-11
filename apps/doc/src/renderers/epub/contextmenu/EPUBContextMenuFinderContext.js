"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUBContextMenuFinderContext = void 0;
const EPUBIFrameContext_1 = require("./EPUBIFrameContext");
const EPUBIFrameMenuPortal_1 = require("./EPUBIFrameMenuPortal");
const react_1 = __importDefault(require("react"));
exports.EPUBContextMenuFinderContext = (props) => {
    return (react_1.default.createElement(EPUBIFrameContext_1.EPUBIFrameContextProvider, { element: props.element },
        react_1.default.createElement(EPUBIFrameMenuPortal_1.EPUBIFrameMenuPortal, null)));
};
//# sourceMappingURL=EPUBContextMenuFinderContext.js.map