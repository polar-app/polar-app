"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buttons = void 0;
const buttonActive = {
    outline: true,
    color: 'primary'
};
const buttonInactive = {
    outline: false,
    color: 'clear'
};
class Buttons {
    static activeProps(active) {
        return active ? buttonActive : buttonInactive;
    }
}
exports.Buttons = Buttons;
//# sourceMappingURL=Buttons.js.map