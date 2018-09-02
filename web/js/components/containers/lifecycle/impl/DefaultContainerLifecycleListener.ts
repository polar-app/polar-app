import {Container} from '../../Container';
import {AbstractContainerLifecycleListener} from './AbstractContainerLifecycleListener';

/**
 * Listens to the lifecycle of .page
 */
export class DefaultContainerLifecycleListener extends AbstractContainerLifecycleListener {


    constructor(container: Container) {
        super(container);
    }

    /**
     * Get the current state from an event.
     *
     * @param event
     */
    getStateFromEvent(event: any) {

        if (event.target && event.target.className === "endOfContent") {
            return this._createContainerLifecycleEvent(true);
        }

        if (event.target && event.target.className === "loadingIcon") {
            return this._createContainerLifecycleEvent(false);
        }

        return undefined;

    }

    /**
     * Get the current state.
     *
     */
    getState() {

        if(this.container.element.querySelector(".endOfContent") !== null) {
            return this._createContainerLifecycleEvent(true);
        }

        if(this.container.element.querySelector(".loadingIcon") !== null) {
            return this._createContainerLifecycleEvent(false);
        }

        return undefined;

    }


}
