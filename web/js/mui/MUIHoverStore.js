"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMUIHoverActive = exports.useMUIHoverListener = exports.useListener = exports.useSetStore = exports.MUIHoverStoreProvider = void 0;
const RXJSStore_1 = require("../react/store/RXJSStore");
_a = RXJSStore_1.createRXJSStore(), exports.MUIHoverStoreProvider = _a[0], exports.useSetStore = _a[1], exports.useListener = _a[2];
function useMUIHoverListener() {
    const setStore = exports.useSetStore();
    const onMouseEnter = () => {
        setStore(true);
    };
    const onMouseLeave = () => {
        setStore(false);
    };
    return { onMouseEnter, onMouseLeave };
}
exports.useMUIHoverListener = useMUIHoverListener;
function useMUIHoverActive() {
    return exports.useListener();
}
exports.useMUIHoverActive = useMUIHoverActive;
//# sourceMappingURL=MUIHoverStore.js.map