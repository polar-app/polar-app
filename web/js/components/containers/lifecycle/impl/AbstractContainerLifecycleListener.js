"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContainerLifecycleState_1 = require("../ContainerLifecycleState");
const Preconditions_1 = require("../../../../Preconditions");
class AbstractContainerLifecycleListener {
    constructor(container) {
        this.container = container;
        this.listener = null;
    }
    register(callback) {
        this.listener = this._createListener(callback);
        let element = this.container.element;
        element.addEventListener('DOMNodeInserted', this.listener, false);
    }
    _createContainerLifecycleEvent(visible) {
        return new ContainerLifecycleState_1.ContainerLifecycleState({
            container: this.container,
            visible
        });
    }
    _createListener(callback) {
        return (event) => {
            let containerLifecycleState = this.getStateFromEvent(event);
            if (Preconditions_1.isPresent(containerLifecycleState)) {
                callback(containerLifecycleState);
            }
        };
    }
    unregister() {
        this.container.element.removeEventListener('DOMNodeInserted', this.listener, false);
        this.listener = null;
    }
}
exports.AbstractContainerLifecycleListener = AbstractContainerLifecycleListener;
//# sourceMappingURL=AbstractContainerLifecycleListener.js.map