class ContainerLifecycleEvent {

    constructor(opts) {

        /**
         * True if this container is now visible.
         *
         * @type {boolean}
         */
        this.visible = undefined;

        Object.assign(this, opts);

    }

}

module.exports.ContainerLifecycleEvent = ContainerLifecycleEvent;
