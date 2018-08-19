import {Preconditions} from '../Preconditions';
import {Event} from './Event';
import {Listener} from './Listener';

export class Reactor<V> {

    private readonly events: {[name: string]: Event<V>} = {};

    constructor() {
    }

    registerEvent(eventName: string): this {

        Preconditions.assertNotNull(eventName, "eventName");

        if(this.events[eventName]) {
            // already registered so don't double register which would kill
            // the existing listeners.
            return this;
        }

        let event = new Event<V>(eventName);
        this.events[eventName] = event;

        return this;

    }

    clearEvent(eventName: string) {
        // replace it with a new event to clear the previous listeners.
        let event = new Event<V>(eventName);
        this.events[eventName] = event;
        return this;
    }

    /**
     *
     * @param eventName The name of the event to dispatch.
     * @param value The event value to dispatch to listeners of that event name.
     * @return {Reactor}
     */
    dispatchEvent(eventName: string, value: V){
        Preconditions.assertNotNull(eventName, "eventName");

        this.events[eventName].getCallbacks().forEach(function(callback){
            // TODO: what if these throw exceptions?
            callback(value);
        });

        return this;

    }

    /**
     *
     * @param eventName {String}
     * @param callback {function}
     * @return {Reactor}
     */
    addEventListener(eventName: string, callback: Listener<V>){
        Preconditions.assertNotNull(eventName, "eventName");

        if(typeof callback !== "function") {
            throw new Error("Callback is not a function: " + typeof callback);
        }

        this.events[eventName].registerCallback(callback);
        return this;
    }

    /**
     *
     * @param eventName {String} The name of the event for the listeners.
     * @return {Array}
     */
    getEventListeners(eventName: string){
        Preconditions.assertNotNull(eventName, "eventName");

        return this.events[eventName].getCallbacks();
    }

}
