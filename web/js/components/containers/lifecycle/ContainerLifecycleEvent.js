class ContainerLifecycleEvent {

    constructor(opts) {

        /**
         * True if this container is now visible.
         *
         * @type {boolean}
         */
        this.visible = undefined;

        /**
         * The container we're working with.
         *
         * @type {Container}
         */
        this.container = undefined;

        Object.assign(this, opts);

    }

}

module.exports.ContainerLifecycleEvent = ContainerLifecycleEvent;
