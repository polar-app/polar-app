"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentCacheDemo = exports.CachedComponent = void 0;
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
exports.CachedComponent = react_1.default.memo(() => {
    console.log("FIXME rendered");
    return react_1.default.createElement("div", null, "this is cached");
});
exports.ComponentCacheDemo = () => {
    const [iter, setIter] = react_1.default.useState(0);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(exports.CachedComponent, null),
        react_1.default.createElement(exports.CachedComponent, null),
        react_1.default.createElement(exports.CachedComponent, null),
        react_1.default.createElement(exports.CachedComponent, null),
        "iter: ",
        iter,
        react_1.default.createElement(Button_1.default, { variant: "contained", onClick: () => setIter(iter + 1) }, "click me")));
};
//# sourceMappingURL=ComponentCacheDemo.js.map