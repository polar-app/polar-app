/**
 *
 */
const {ContainerLifecycleListener} = require("../ContainerLifecycleListener");
const {ContainerLifecycleState} = require("../ContainerLifecycleState");

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

        this.listener = this._createListener(callback);

        let element = this.container.element;

        element.addEventListener('DOMNodeInserted', this.listener, false);

    }

    _createContainerLifecycleEvent(visible) {

        return new ContainerLifecycleState({
            container: this.container,
            visible
        });

    }

    _createListener(callback) {

        return event => {

            let containerLifecycleState = this.getStateFromEvent(event);

            if(containerLifecycleState) {
                callback(containerLifecycleState);
            }

        }

    }

    unregister() {

        this.container.element.removeEventListener('DOMNodeInserted', this.listener, false);
        this.listener = null;

    }

}

module.exports.AbstractContainerLifecycleListener = AbstractContainerLifecycleListener;
