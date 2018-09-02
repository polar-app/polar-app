"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractContainerLifecycleListener_1 = require("./AbstractContainerLifecycleListener");
class ThumbnailContainerLifecycleListener extends AbstractContainerLifecycleListener_1.AbstractContainerLifecycleListener {
    constructor(container) {
        super(container);
    }
    getStateFromEvent(event) {
        return this._createContainerLifecycleEvent(true);
    }
    getState() {
        return this._createContainerLifecycleEvent(true);
    }
}
exports.ThumbnailContainerLifecycleListener = ThumbnailContainerLifecycleListener;
//# sourceMappingURL=ThumbnailContainerLifecycleListener.js.map