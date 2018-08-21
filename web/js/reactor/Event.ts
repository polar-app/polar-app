
// https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript

import {Listener} from './Listener';

export class Event<V> {

    public readonly name: string;

    private readonly callbacks: Listener<V>[] = [];

    constructor(name: string) {
        this.name = name;
    }

    registerCallback(callback: Listener<V>){
        this.callbacks.push(callback);
    }

    getCallbacks() {
        return this.callbacks;
    }

}
