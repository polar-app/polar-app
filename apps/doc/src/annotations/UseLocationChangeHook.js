"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocationUpdateListener = void 0;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
function useLocationUpdateListener() {
    const history = react_router_dom_1.useHistory();
    const first = react_1.default.useRef(true);
    function listen(listener) {
        return history.listen(newLocation => {
            if (!first.current) {
                listener(newLocation);
            }
            first.current = false;
        });
    }
    return { listen };
}
exports.useLocationUpdateListener = useLocationUpdateListener;
//# sourceMappingURL=UseLocationChangeHook.js.map