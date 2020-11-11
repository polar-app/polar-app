"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuerySelector = void 0;
const react_1 = __importDefault(require("react"));
const ReactLifecycleHooks_1 = require("../../web/js/hooks/ReactLifecycleHooks");
const ReactUtils_1 = require("../../web/js/react/ReactUtils");
function createQuerySelector() {
    return ReactUtils_1.deepMemo(function (props) {
        const [element, setElement] = react_1.default.useState();
        ReactLifecycleHooks_1.useComponentDidMount(() => {
            const newElement = props.selector();
            if (!newElement) {
                throw new Error("No element for selector");
            }
            setElement(newElement);
        });
        if (element) {
            return props.component({ element });
        }
        return null;
    });
}
exports.createQuerySelector = createQuerySelector;
//# sourceMappingURL=QuerySelector.js.map