/**
 * A Reactor that only sends one type of event.
 */
import {IMutableReactor, IReactor, Reactor} from './Reactor';
import {Listener} from './Listener';

const EVENT_NAME = 'event';

export class SimpleReactor<V> implements ISimpleReactor<V> {

    private readonly delegate: IMutableReactor<V>;

    constructor(delegate: IMutableReactor<V> = new Reactor<V>()) {
        this.delegate = delegate;
        this.delegate.registerEvent(EVENT_NAME);
    }

    public dispatchEvent(value: V) {
        this.delegate.dispatchEvent(EVENT_NAME, value);
    }

    public clear() {
        this.delegate.clearEvent(EVENT_NAME);
    }

    public addEventListener(listener: Listener<V>) {
        this.delegate.addEventListener(EVENT_NAME, listener);
    }

    public once(): Promise<V> {
        return this.delegate.once(EVENT_NAME);
    }

    public removeEventListener(listener: Listener<V>): boolean {
        return this.delegate.removeEventListener(EVENT_NAME, listener);
    }

    /**
     *
     */
    public getEventListeners() {
        return this.delegate.getEventListeners(EVENT_NAME);
    }

}

export interface ISimpleReactor<V> {
    once(): Promise<V>;
    addEventListener(listener: Listener<V>): void;
    removeEventListener(listener: Listener<V>): boolean;
    dispatchEvent(value: V): void;
}

export interface IEventDispatcher<V> extends ISimpleReactor<V> {

}
