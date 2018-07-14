const {DefaultContainerLifecycleListener} = require("../../lifecycle/impl/DefaultContainerLifecycleListener");
const {ContainerProvider} = require("../ContainerProvider");

class DefaultContainerProvider extends ContainerProvider {

    /**
     *
     * @return {Object<number,HTMLElement>}
     */
    getContainers() {

        let result = {};

        let pageElements = Array.from(document.querySelectorAll(".page"));

        pageElements.forEach(pageElement => {
            let id = parseInt(pageElement.getAttribute("data-page-number"));
            result[id] = pageElement;
        });

        return result;

    }

    /**
     * @Override
     * @param container {HTMLElement}
     * @return {ContainerLifecycleListener}
     */
    createContainerLifecycleListener(container) {
        return new DefaultContainerLifecycleListener(container);
    }

}

module.exports.DefaultContainerProvider = DefaultContainerProvider;
