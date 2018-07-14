/**
 * @abstract
 */
class ContainerHelper {

    /**
     * Return all containers in the document.
     *
     * @return {Array<Container>}
     */
    getContainers() {
        throw new Error("Not implemented");
    }

    /**
     * Get the {ContainerLifecycleListener} to use with the container types.
     *
     * @param
     * @return {ContainerLifecycleListener}
     */
    createContainerLifecyleListener(container) {
        throw new Error("Not implemented");
    }

}

module.exports.ContainerHelper = ContainerHelper;
