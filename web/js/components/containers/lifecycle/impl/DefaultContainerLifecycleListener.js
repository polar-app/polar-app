/**
 *
 */
const {ContainerLifecycleListener} = require("../ContainerLifecycleListener");
const {ContainerLifecycleState} = require("../ContainerLifecycleState");

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

        // TODO: it would be cleaner to keep these in a map and add and remove them by pattern.

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

            // FIXME: this will give us too many events...

            let containerLifecycleState = this.getStateFromEvent(event);
            if(containerLifecycleState) {
                console.log("container lifecycle state change: FIXME: " + JSON.stringify(containerLifecycleState))
                callback(containerLifecycleState);
            }

        }

    }

    /**
     * Get the current state from an event.
     *
     * @param event
     * @return {ContainerLifecycleState | null}
     */
    getStateFromEvent(event) {

        if (event.target && event.target.className === "endOfContent") {
            return this._createContainerLifecycleEvent(true);
        }

        if (event.target && event.target.className === "loadingIcon") {
            return this._createContainerLifecycleEvent(false);
        }

        return null;

    }

    /**
     * Get the current state.
     *
     * @return {ContainerLifecycleState}
     */
    getState() {

        if(this.container.element.querySelector(".endOfContent") !== null) {
            return this._createContainerLifecycleEvent(true);
        }

        if(this.container.element.querySelector(".loadingIcon") !== null) {
            return this._createContainerLifecycleEvent(false);
        }

        throw new Error("Unable to determine state.")

    }

    unregister() {

        this.container.element.removeEventListener('DOMNodeInserted', this.listener, false);

    }

}

module.exports.DefaultContainerLifecycleListener = DefaultContainerLifecycleListener;
