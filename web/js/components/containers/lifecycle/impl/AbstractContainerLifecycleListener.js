/**
 *
 */
const {ContainerLifecycleListener} = require("../ContainerLifecycleListener");
const {ContainerLifecycleEvent} = require("../ContainerLifecycleEvent");

/**
 * Listens to the lifecycle of .page
 */
class AbstractContainerLifecycleListener extends ContainerLifecycleListener {

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

        this.pageElement.addEventListener('DOMNodeInserted', event => {
            if(this._testEvent(event)) {

            }
        }, false);

    };

    /**
     * @abstract
     * @private
     * @return {boolean} Return true if this is the event we're monitoring.
     */
    _testEvent(event) {
        throw new Error("Not implemented");
    }

    unregister() {
        this.pageElement.removeEventListener('DOMNodeInserted', this.listener, false);
        this.listener = null;
    }

}

module.exports.AbstractContainerLifecycleListener = AbstractContainerLifecycleListener;
