/**
 *
 */
const {ContainerLifecycleListener} = require("../ContainerLifecycleListener");
const {ContainerLifecycleEvent} = require("../ContainerLifecycleEvent");

/**
 * Listens to the lifecycle of .page
 */
class DefaultContainerLifecycleListener extends ContainerLifecycleListener {

    constructor(pageElement) {
        super();
        this.pageElement = pageElement;
        this.listener = null;

    }

    register(callback) {

        this.listener = event => {

            if (event.target && event.target.className === "endOfContent") {

                callback(new ContainerLifecycleEvent({
                    container: this.pageElement,
                    visible: true
                }));
            }

        };

        this.pageElement.addEventListener('DOMNodeInserted', this.listener, false);

    };

    unregister() {
        this.pageElement.removeEventListener('DOMNodeInserted', this.listener, false);
        this.listener = null;
    }

}

module.exports.DefaultContainerLifecycleListener = DefaultContainerLifecycleListener;
