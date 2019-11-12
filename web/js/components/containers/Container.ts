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
     */
    public components: Component[] = [];

    public page: number;

    constructor(opts: IContainer) {

        this.id = opts.id;
        this.element = opts.element;
        this.components = opts.components || [];
        this.page = opts.page;

    }

    addComponent(component: Component) {
        this.components.push(component);
    }

    getComponents() {
        return this.components;
    }

}

interface IContainer {
    readonly id: number;
    readonly element: HTMLElement;
    readonly components?: Component[];
    readonly page: number;
}
