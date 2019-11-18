import {Container} from '../../Container';
import {ContainerLifecycleListener} from '../ContainerLifecycleListener';
import {ContainerLifecycleState} from '../ContainerLifecycleState';

export type ContainerLifecycleStateCallback = (state: ContainerLifecycleState) => void;

/**
 * Listens to the lifecycle of .page
 */
export abstract class AbstractContainerLifecycleListener implements ContainerLifecycleListener {

    protected readonly container: Container;

    protected observer: MutationObserver | undefined;

    protected state: ContainerLifecycleState;

    protected constructor(container: Container) {
        this.container = container;
        console.log("FIXME: starting container with element: ", container.element);

        const visible = this.isVisible();
        this.state = new ContainerLifecycleState({container, visible});
    }

    public register(callback: ContainerLifecycleStateCallback) {

        const container = this.container;

        this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                console.log("FIXME: got mutation: " + mutation.type);
                if (mutation.type == "attributes") {
                    const visible = this.isVisible();
                    console.log("FIXME: visible: " + visible);
                    this.state = new ContainerLifecycleState({container, visible});
                    callback(this.state);
                }
            }

        });

        this.observer.observe(container.element, {
            // only monitor attributes.
            attributes: true
        });

    }

    protected isVisible() {
        return this.container.element.getAttribute('data-loaded') === 'true'
    }

    protected _createContainerLifecycleEvent(visible: boolean) {

        return new ContainerLifecycleState({
            container: this.container,
            visible
        });

    }

    public getState(): ContainerLifecycleState {
        return this.state;
    }

    public unregister() {

        if (this.observer) {
            this.observer!.disconnect();
        }

    }

}
