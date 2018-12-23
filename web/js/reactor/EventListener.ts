export type EventListener<V> = (value: V) => void;

export interface RegisteredEventListener<V> extends Releaseable {

    eventListener: EventListener<V>;

    /**
     * Remove the listener after it's been registered..
     */
    release(): void;

}

export interface Releaseable {
    release(): void;
}

/**
 * Register and release multiple Releaseables.
 */
export class MultiReleaser implements Releaseable {

    private releaseables: Releaseable[] = [];

    public register(releaseable: Releaseable) {
        this.releaseables.push(releaseable);
    }

    public release() {
        for (const releaseable of this.releaseables) {
            releaseable.release();
        }
    }

}
