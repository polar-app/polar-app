"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = exports.useRefTracker = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../../web/js/react/ReactUtils");
function useRefTracker() {
    const [ref, setRef] = react_1.default.useState(null);
    const listener = (newRef) => {
        if (newRef !== ref) {
            setRef(newRef);
        }
    };
    const RefTracker = (props) => {
        if (ref) {
            return props.children;
        }
        return null;
    };
    return [listener, RefTracker];
}
exports.useRefTracker = useRefTracker;
const Primary = ReactUtils_1.memoForwardRef((props) => {
    console.log("primary render");
    const [refListener, RefTracker] = useRefTracker();
    return (react_1.default.createElement("div", { ref: refListener },
        "primary",
        react_1.default.createElement(RefTracker, null,
            react_1.default.createElement(Secondary, null))));
});
const Secondary = ReactUtils_1.memoForwardRef(() => {
    console.log("secondary render");
    return (react_1.default.createElement("div", null, "secondary"));
});
exports.App = () => {
    console.log('App render');
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(Primary, null,
            react_1.default.createElement(Secondary, null))));
};
//# sourceMappingURL=App.js.map