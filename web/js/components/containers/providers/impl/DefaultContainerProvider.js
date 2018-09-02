"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContainerProvider_1 = require("../ContainerProvider");
const DefaultContainerLifecycleListener_1 = require("../../lifecycle/impl/DefaultContainerLifecycleListener");
class DefaultContainerProvider extends ContainerProvider_1.ContainerProvider {
    getContainers() {
        return super._getContainers(".page");
    }
    createContainerLifecycleListener(container) {
        return new DefaultContainerLifecycleListener_1.DefaultContainerLifecycleListener(container);
    }
}
exports.DefaultContainerProvider = DefaultContainerProvider;
//# sourceMappingURL=DefaultContainerProvider.js.map