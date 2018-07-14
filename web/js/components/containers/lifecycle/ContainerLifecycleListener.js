class ContainerLifecycleListener {

    /**
     *
     * @param callback {Function} A callback function that accepts
     * {ContainerLifecycleEvent} to determine the state of the container.
     *
     */
    register(callback) {

    }

    unregister() {

    }

    /**
     * Get the current state from an event.
     *
     * @param event
     * @return {ContainerLifecycleState | null}
     */
    getStateFromEvent(event) {

    }

    /**
     * Get the current state.
     *
     * @return {ContainerLifecycleState}
     */
    getState() {


    }

}

module.exports.ContainerLifecycleListener = ContainerLifecycleListener;
