"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseLocationChangeRoot = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const UseLocationChangeStore_1 = require("./UseLocationChangeStore");
const ScrollIntoViewUsingLocation_1 = require("./ScrollIntoViewUsingLocation");
exports.UseLocationChangeRoot = ReactUtils_1.deepMemo((props) => {
    const { setInitialScrollLoader } = UseLocationChangeStore_1.useUseLocationChangeCallbacks();
    const scrolledNonce = react_1.default.useRef(undefined);
    setInitialScrollLoader((scrollTarget, ref) => {
        if (!ref) {
            return;
        }
        const target = ref.getAttribute('id');
        if (!target) {
            return;
        }
        if (scrolledNonce.current === scrollTarget.n) {
            return;
        }
        if (target === (scrollTarget === null || scrollTarget === void 0 ? void 0 : scrollTarget.target)) {
            try {
                ScrollIntoViewUsingLocation_1.scrollIntoView(scrollTarget, ref);
            }
            finally {
                scrolledNonce.current = scrollTarget.n;
            }
        }
    });
    return props.children;
});
//# sourceMappingURL=UseLocationChangeRoot.js.map