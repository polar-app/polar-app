const {AbstractContainerLifecycleListener} = require("./AbstractContainerLifecycleListener");
const {ContainerLifecycleListener} = require("../ContainerLifecycleListener");
const {ContainerLifecycleState} = require("../ContainerLifecycleState");

/**
 * Listens to the lifecycle of .page
 */
class DefaultContainerLifecycleListener extends AbstractContainerLifecycleListener {

    /**
     * @param container {Container}
     */
    constructor(container) {
        super(container);
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


}

module.exports.DefaultContainerLifecycleListener = DefaultContainerLifecycleListener;
