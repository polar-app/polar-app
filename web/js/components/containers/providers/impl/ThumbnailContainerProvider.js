"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContainerProvider_1 = require("../ContainerProvider");
const ThumbnailContainerLifecycleListener_1 = require("../../lifecycle/impl/ThumbnailContainerLifecycleListener");
class ThumbnailContainerProvider extends ContainerProvider_1.ContainerProvider {
    getContainers() {
        return super._getContainers(".thumbnail");
    }
    createContainerLifecycleListener(container) {
        return new ThumbnailContainerLifecycleListener_1.ThumbnailContainerLifecycleListener(container);
    }
}
exports.ThumbnailContainerProvider = ThumbnailContainerProvider;
//# sourceMappingURL=ThumbnailContainerProvider.js.map