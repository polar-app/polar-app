"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinchToZoom = exports.Gestures = void 0;
class Gestures {
}
exports.Gestures = Gestures;
const DISABLER = (e) => {
    e.preventDefault();
};
class PinchToZoom {
    static enable() {
        document.addEventListener('gesturestart', DISABLER);
    }
    static disable() {
    }
}
exports.PinchToZoom = PinchToZoom;
//# sourceMappingURL=Gestures.js.map