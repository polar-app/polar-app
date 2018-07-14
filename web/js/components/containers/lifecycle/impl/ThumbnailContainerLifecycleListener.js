const {AbstractContainerLifecycleListener} = require("./AbstractContainerLifecycleListener");

/**
 * Listens to the lifecycle of .thumbnail
 */
class ThumbnailContainerLifecycleListener extends AbstractContainerLifecycleListener {

    /**
     * @param container {Container}
     */
    constructor(container) {
        super();
        this.container = container;
        this.listener = null;

    }

    /**
     * Get the current state from an event.
     *
     * @param event
     * @return {ContainerLifecycleState | null}
     */
    getStateFromEvent(event) {

        return this._createContainerLifecycleEvent(true);
        //
        // if (event.target && event.target.className === "endOfContent") {
        //     return this._createContainerLifecycleEvent(true);
        // }
        //
        // if (event.target && event.target.className === "loadingIcon") {
        //     return this._createContainerLifecycleEvent(false);
        // }
        //
        // return null;

    }

    /**
     * Get the current state.
     *
     * @return {ContainerLifecycleState}
     */
    getState() {

        return this._createContainerLifecycleEvent(true);

        //
        // if(this.container.element.querySelector(".thumbnailImage") !== null) {
        //     return this._createContainerLifecycleEvent(true);
        // } else {
        //     return this._createContainerLifecycleEvent(false);
        // }

    }

}

module.exports.ThumbnailContainerLifecycleListener = ThumbnailContainerLifecycleListener;
