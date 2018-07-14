/**
 *
 */
const {ContainerLifecycleListener} = require("../ContainerLifecycleListener");
const {ContainerLifecycleEvent} = require("../ContainerLifecycleEvent");

/**
 * Listens to the lifecycle of .page
 */
class DefaultContainerLifecycleListener extends ContainerLifecycleListener {

    /**
     * @param container {Container}
     */
    constructor(container) {
        super();
        this.container = container;
        this.listener = null;

    }

    register(callback) {

        this.listener = event => {

            if (event.target && event.target.className === "endOfContent") {

                callback(new ContainerLifecycleEvent({
                    container: this.container,
                    visible: true
                }));

            }

        };

        this.container.element.addEventListener('DOMNodeInserted', this.listener, false);

    };

    unregister() {
        this.container.element.removeEventListener('DOMNodeInserted', this.listener, false);
        this.listener = null;
    }

}

module.exports.DefaultContainerLifecycleListener = DefaultContainerLifecycleListener;
