import {Preconditions} from '../Preconditions';
import {Event} from './Event';
import {Listener} from './Listener';
import {Logger} from '../logger/Logger';

const log = Logger.create();

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

    eventNames(): string[] {
        return Object.keys(this.events);
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

        let event = this.events[eventName];

        if(! event) {
            throw new Error("No events for event name: " + eventName);
        }

        event.getCallbacks().forEach(function(callback){

            try {

                callback(value);

            } catch(e) {
                log.error("Callback generated unhandled exception: ", e);
            }


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

        if(this.events[eventName] === undefined) {
            throw new Error("No registered event for event name: " + eventName);
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
