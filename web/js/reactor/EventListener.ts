export type EventListener<V> = (value: V) => void;

export interface RegisteredEventListener<V> extends Releaseable {

    listener: EventListener<V>;

    /**
     * Remove the listener after it's been registered..
     */
    release(): void;

}

export interface Releaseable {
    release(): void;
}


export class RegisteredEventListenerReleaser implements Releaseable {

    private eventListeners: Array<RegisteredEventListener<any>> = [];

    public register(eventListener: RegisteredEventListener<any>) {
        this.eventListeners.push(eventListener);
    }

    public release() {
        for (const eventListener of this.eventListeners) {
            eventListener.release();
        }
    }

}
