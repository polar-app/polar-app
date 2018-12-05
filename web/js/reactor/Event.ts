
// https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript

import {Listener} from './Listener';

export class Event<V> {

    public readonly name: string;

    private readonly listeners: Array<Listener<V>> = [];

    constructor(name: string) {
        this.name = name;
    }

    public registerListener(listener: Listener<V>) {
        this.listeners.push(listener);
    }

    public getListeners() {
        return this.listeners;
    }

    public hasListeners() {
        return this.listeners.length > 0;
    }

    public removeListener(listener: Listener<V>): boolean {

        const index = this.listeners.indexOf(listener);

        if (index > -1) {
            this.listeners.splice(index, 1);
            return true;
        }

        return false;

    }

    public size() {
        return this.listeners.length;
    }

}
