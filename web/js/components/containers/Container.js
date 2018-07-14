
class Container {

    constructor(opts) {

        /**
         * The ID for this container.
         *
         * @type {number}
         */
        this.id = undefined;

        /**
         * The element representing this container. Usually a .page or a .thumbnail.
         *
         * @type {undefined}
         */
        this.element = undefined;

        /**
         * The components that this container hosts.
         *
         * @type {Array<Component>}
         */
        this.components = [];

        Object.assign(this, opts);

    }

    /**
     *
     * @param component {Component}
     */
    addComponent(component) {
        this.components.push(component);
    }

    /**
     *
     * @return {Array<Component>}
     */
    getComponents() {
        return this.components;
    }

}

module.exports.Container = Container;
