import * as ReactDOM from 'react-dom';
import * as React from 'react';

/**
 * Ability to inject a small react app on a page without much hassle.
 */
export namespace ReactInjector {

    export interface Opts {
        readonly id?: string;
        readonly doc?: Document;
        readonly root?: HTMLElement;
    }


    /**
     * Inject a component.  When the ID is given we use the ID and ensure
     * that only one component with that ID is created.
     */
    export function inject(element: JSX.Element, opts: Opts = {}) {

        const {id} = opts;

        const doc = opts.doc || document;
        const root = opts.root || doc.body;

        let container = doc.createElement('div');

        if (id) {

            const existingContainer = doc.getElementById(id);

            if (existingContainer) {
                return new InjectedComponent(existingContainer);
            } else {

                container = doc.createElement('div');
                container.setAttribute('id', id);

            }

        }

        root.appendChild(container);

        return create(element, container);

    }

    export function create(element: JSX.Element, container: HTMLElement) {

        ReactDOM.render(
            element,
            container
        );

        return new InjectedComponent(container);

    }

}

/**
 * Allows us to destroy the component.
 */
export class InjectedComponent {

    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    public destroy() {

        if (this.container) {
            this.container.innerHTML = '';
            this.container.parentElement!.removeChild(this.container);
            this.container = null!;
        } else {
            // noop, already destroyed
        }

    }

}
