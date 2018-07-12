const {Event} = require("./Event");
const {Preconditions} = require("../Preconditions");

class Reactor {

    constructor() {
        this.events = {};
    }

    /**
     * @param eventName {String}
     * @return {Reactor}
     */
    registerEvent(eventName){
        Preconditions.assertNotNull(eventName, "eventName");

        if(this.events[eventName]) {
            // already registered so don't double register which would kill
            // the existing listeners.
            return this;
        }

        let event = new Event(eventName);
        this.events[eventName] = event;
        return this;

    }

    clearEvent(eventName) {
        // replace it with a new event to clear the previous listeners.
        let event = new Event(eventName);
        this.events[eventName] = event;
        return this;
    }

    /**
     *
     * @param eventName {String}
     * @param eventArgs {...Object} The list of events that are raised.
     * @return {Reactor}
     */
    dispatchEvent(eventName, ...eventArgs){
        Preconditions.assertNotNull(eventName, "eventName");

        this.events[eventName].callbacks.forEach(function(callback){
            callback(...eventArgs);
        });
        return this;
    }

    /**
     *
     * @param eventName {String}
     * @param callback {function}
     * @return {Reactor}
     */
    addEventListener(eventName, callback){
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
    getEventListeners(eventName){
        Preconditions.assertNotNull(eventName, "eventName");

        return this.events[eventName].callbacks;
    }

};

module.exports.Reactor = Reactor;
