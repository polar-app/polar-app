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
