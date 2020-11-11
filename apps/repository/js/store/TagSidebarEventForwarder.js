"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTagSidebarEventForwarder = exports.TagSidebarEventForwarderContext = void 0;
const react_1 = __importDefault(require("react"));
const NullTagSidebarEventForwarder = {
    onTagSelected: (tags) => console.log("WARN: using null tag selector: ", tags),
    onDropped: (tag) => console.log("WARN: using null tag selector: ", tag)
};
exports.TagSidebarEventForwarderContext = react_1.default.createContext(NullTagSidebarEventForwarder);
function useTagSidebarEventForwarder() {
    return react_1.default.useContext(exports.TagSidebarEventForwarderContext);
}
exports.useTagSidebarEventForwarder = useTagSidebarEventForwarder;
//# sourceMappingURL=TagSidebarEventForwarder.js.map