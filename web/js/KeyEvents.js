"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyEvents {
    static isKeyMetaActive(event) {
        if (this.isMacOS()) {
            return event.metaKey && event.altKey;
        }
        else {
            return event.ctrlKey && event.altKey;
        }
    }
    static isMacOS() {
        return navigator.platform === "MacIntel";
    }
}
exports.KeyEvents = KeyEvents;
//# sourceMappingURL=KeyEvents.js.map