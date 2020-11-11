"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blackout = void 0;
const Elements_1 = require("../../util/Elements");
const ID = 'polar-blackout';
class Blackout {
    static toggle(value, opts = {}) {
        if (value) {
            this.enable(opts);
        }
        else {
            this.disable();
        }
    }
    static enable(opts = {}) {
        if (this.isEnabled()) {
            return;
        }
        const blackoutElement = Elements_1.Elements.createElementHTML(`<div id="${ID}" style="">`);
        blackoutElement.style.height = '100%';
        blackoutElement.style.width = '100%';
        blackoutElement.style.position = 'absolute';
        blackoutElement.style.top = '0';
        blackoutElement.style.left = '0';
        blackoutElement.style.backgroundColor = '#000000';
        blackoutElement.style.opacity = '0.7';
        blackoutElement.style.zIndex = '999';
        if (opts.noPointerEvents) {
            blackoutElement.style.pointerEvents = 'none';
        }
        document.body.appendChild(blackoutElement);
    }
    static disable() {
        const element = document.getElementById(ID);
        if (element && element.parentElement) {
            element.parentElement.removeChild(element);
        }
    }
    static isEnabled() {
        return document.getElementById(ID) !== null;
    }
}
exports.Blackout = Blackout;
//# sourceMappingURL=Blackout.js.map