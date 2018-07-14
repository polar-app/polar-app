/**
 * @abstract
 */
class ContainerProvider {

    /**
     * Return all containers in the document indexed by their ID.  For pages
     * and thumbnails this is just going to be the page number.
     *
     * @return {Object<number,HTMLElement>}
     */
    getContainers() {
        throw new Error("Not implemented");
    }

    /**
     * Get the {ContainerLifecycleListener} to use with the container types.
     *
     * @param container {HTMLElement}
     * @return {ContainerLifecycleListener}
     */
    createContainerLifecycleListener(container) {
        throw new Error("Not implemented");
    }

}

module.exports.ContainerProvider = ContainerProvider;
