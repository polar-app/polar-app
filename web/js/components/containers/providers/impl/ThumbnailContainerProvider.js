const {ThumbnailContainerLifecycleListener} = require("../../lifecycle/impl/ThumbnailContainerLifecycleListener");
const {ContainerProvider} = require("../ContainerProvider");

class ThumbnailContainerProvider extends ContainerProvider {

    /**
     *
     * @return {Object<number,HTMLElement>}
     */
    getContainers() {
        return super._getContainers(".thumbnail");
    }

    /**
     * @Override
     * @param container {HTMLElement}
     * @return {ContainerLifecycleListener}
     */
    createContainerLifecycleListener(container) {
        return new ThumbnailContainerLifecycleListener(container);
    }

}

module.exports.ThumbnailContainerProvider = ThumbnailContainerProvider;
