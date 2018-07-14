const {Container} = require("../Container");

/**
 * @abstract
 */
class ContainerProvider {

    /**
     * Return all containers in the document indexed by their ID.  For pages
     * and thumbnails this is just going to be the page number.
     *
     * @return {Object<number,Container>}
     */
    getContainers() {
        throw new Error("Not implemented");
    }

    /**
     *
     * @return {Object<number,Container>}
     */
    _getContainers(selector) {

        let result = {};

        let elements = Array.from(document.querySelectorAll(selector));

        elements.forEach(element => {
            let id = parseInt(element.getAttribute("data-page-number"));
            let container = new Container({id, element });
            result[id] = container;
        });

        return result;

    }

    /**
     * Get the {ContainerLifecycleListener} to use with the container types.
     *
     * @param container {Container}
     * @return {ContainerLifecycleListener}
     */
    createContainerLifecycleListener(container) {
        throw new Error("Not implemented");
    }

}

module.exports.ContainerProvider = ContainerProvider;
