"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractContainerLifecycleListener_1 = require("./AbstractContainerLifecycleListener");
class DefaultContainerLifecycleListener extends AbstractContainerLifecycleListener_1.AbstractContainerLifecycleListener {
    constructor(container) {
        super(container);
    }
    getStateFromEvent(event) {
        if (event.target && event.target.className === "endOfContent") {
            return this._createContainerLifecycleEvent(true);
        }
        if (event.target && event.target.className === "loadingIcon") {
            return this._createContainerLifecycleEvent(false);
        }
        return undefined;
    }
    getState() {
        if (this.container.element.querySelector(".endOfContent") !== null) {
            return this._createContainerLifecycleEvent(true);
        }
        if (this.container.element.querySelector(".loadingIcon") !== null) {
            return this._createContainerLifecycleEvent(false);
        }
        throw new Error("Unable to determine state.");
    }
}
exports.DefaultContainerLifecycleListener = DefaultContainerLifecycleListener;
//# sourceMappingURL=DefaultContainerLifecycleListener.js.map