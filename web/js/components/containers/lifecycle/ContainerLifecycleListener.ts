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
     * Get the current state from an event.
     *
     * @param event
     * @return {ContainerLifecycleState | null}
     */
    getStateFromEvent(event: any): ContainerLifecycleState | undefined;


    /**
     * Get the current state.
     *
     * @return {ContainerLifecycleState}
     */
    getState(): ContainerLifecycleState;

}
