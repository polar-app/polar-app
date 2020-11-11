"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIModes = void 0;
const UI_MODES = ['light', 'dark'];
class UIModes {
    static register() {
        const uiMode = this.currentMode();
        this.toggleMode(uiMode);
    }
    static currentMode() {
        const uiMode = localStorage.getItem('ui-mode');
        if (uiMode && UI_MODES.includes(uiMode)) {
            return uiMode;
        }
        return "light";
    }
    static toggleMode(uiMode) {
        const htmlElement = document.querySelector("html");
        htmlElement.classList.remove('ui-mode-light');
        htmlElement.classList.remove('ui-mode-dark');
        htmlElement.classList.add('ui-mode-' + uiMode);
    }
}
exports.UIModes = UIModes;
//# sourceMappingURL=UIModes.js.map