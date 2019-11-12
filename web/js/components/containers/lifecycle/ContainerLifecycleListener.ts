import {ContainerLifecycleState} from './ContainerLifecycleState';

export interface ContainerLifecycleListener {

    /**
     *
     * @param callback {Function} A callback function that accepts
     * {ContainerLifecycleEvent} to determine the state of the container.
     *
     */
    register(callback: (event: any) => void): void;


    unregister(): void;

    /**
     * Get the current state.
     *
     */
    getState(): ContainerLifecycleState | undefined;

}
