/**
 * A Reactor that only sends one type of event.
 */
import {Reactor} from './Reactor';
import {Listener} from './Listener';

export class SimpleReactor<T> {

    private readonly delegate = new Reactor<T>();

    constructor() {
        this.delegate.registerEvent('event');
    }

    public dispatchEvent(value: T) {
        this.delegate.dispatchEvent('event', value);
    }


    public clear() {
        this.delegate.clearEvent('event');
    }

    public addEventListener(callback: Listener<T>) {
        this.delegate.addEventListener('event', callback);
    }

    /**
     *
     */
    public getEventListeners() {
        return this.delegate.getEventListeners('event');
    }

}

