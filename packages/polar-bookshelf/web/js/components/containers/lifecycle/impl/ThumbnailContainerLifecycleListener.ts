import {Container} from '../../Container';
import {AbstractContainerLifecycleListener} from './AbstractContainerLifecycleListener';

/**
 * Listens to the lifecycle of .thumbnail
 */
export class ThumbnailContainerLifecycleListener extends AbstractContainerLifecycleListener {

    /**
     */
    constructor(container: Container) {
        super(container);

    }

    /**
     * Get the current state from an event.
     *
     * @param event
     * @return {ContainerLifecycleState | null}
     */
    getStateFromEvent(event: any) {

        return this._createContainerLifecycleEvent(true);

    }

    /**
     * Get the current state.
     *
     * @return {ContainerLifecycleState}
     */
    getState() {

        return this._createContainerLifecycleEvent(true);

    }

}
