"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MousePositions = void 0;
class MousePositions {
    static get() {
        return mousePosition;
    }
}
exports.MousePositions = MousePositions;
let mousePosition = {
    clientX: 0,
    clientY: 0
};
window.addEventListener('mousemove', event => {
    mousePosition = {
        clientX: event.clientX,
        clientY: event.clientY
    };
});
//# sourceMappingURL=MousePositions.js.map