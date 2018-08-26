import {Component} from 'react';

export class Container {

    /**
     * The ID for this container.
     */
    public id: number;

    /**
     * The element representing this container. Usually a .page or a .thumbnail.
     */
    public element: HTMLElement;

    /**
     * The components that this container hosts.
     *
     * @type {Array<Component>}
     */
    public components: Component[] = [];

    constructor(opts: any = {}) {

        this.id = opts.id;
        this.element = opts.element;
        this.components = opts.components || [];

    }

    addComponent(component: Component) {
        this.components.push(component);
    }

    getComponents() {
        return this.components;
    }

}
