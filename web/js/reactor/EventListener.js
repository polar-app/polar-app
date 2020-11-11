"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Releaser = void 0;
class Releaser {
    constructor() {
        this.releaseables = [];
        this.released = false;
    }
    register(releaseable) {
        if (typeof releaseable === 'function') {
            const delegate = releaseable;
            releaseable = {
                release() {
                    delegate();
                }
            };
        }
        this.releaseables.push(releaseable);
    }
    release() {
        for (const releaseable of this.releaseables) {
            releaseable.release();
        }
        this.released = true;
    }
}
exports.Releaser = Releaser;
//# sourceMappingURL=EventListener.js.map