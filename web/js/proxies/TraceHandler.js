const {TraceListenerExecutor} = require("./TraceListenerExecutor");
const {TraceEvent} = require("./TraceEvent");
const {Preconditions} = require("../Preconditions");
const {MutationType} = require("./MutationType");
const {FunctionalInterface} = require("../util/FunctionalInterface");
const {Reactor} = require("../reactor/Reactor");
const {TraceListeners} = require("./TraceListeners");

const EVENT_NAME = "onMutation";

module.exports.TraceHandler = class {

    /**
     *
     * @param path The path to this object.
     * @param traceListener The main TraceListener to use.
     * @param target The object that is the target of this handler.
     */
    constructor(path, traceListeners, target) {

        Preconditions.assertNotNull(path, "path");
        this.path = path;

        this.target = target;

        this.reactor = new Reactor();
        this.reactor.registerEvent(EVENT_NAME);
        this.addTraceListener(traceListeners);

    }

    /**
     * Add a listener to a specific object. By default we return all events but
     * you can also narrow it down to a specific property by specifying a given
     * property to monitor.
     */
    addTraceListener(traceListeners, options) {

        if (!options) {
            options = {};
        }

        traceListeners = TraceListeners.asArray(traceListeners);

        let eventName = EVENT_NAME;

        if(options.property) {
            eventName = `${eventName}:${options.property}`;
        }

        traceListeners.forEach(traceListener => {

            traceListener = FunctionalInterface.create(EVENT_NAME, traceListener);

            this.reactor.addEventListener(eventName, function(traceEvent) {
                traceListener.onMutation(traceEvent);
            });

        });

        return new TraceListenerExecutor(traceListeners, this);

    }

    getTraceListeners() {
        return this.reactor.getEventListeners()
    }

    set(target, property, value, receiver) {

        // TODO: before we change the value, also trace the new input values
        // if we are given an object.

        let previousValue = target[property];

        let result = Reflect.set(...arguments);
        let traceEvent = new TraceEvent(this.path, MutationType.SET, target, property, value, previousValue);
        this.reactor.dispatchEvent(EVENT_NAME, traceEvent);
        return result;

    }

    deleteProperty(target, property) {

        let previousValue = target[property];

        let result = Reflect.deleteProperty(...arguments);
        let traceEvent = new TraceEvent(this.path, MutationType.DELETE, target, property, undefined, previousValue);
        this.reactor.dispatchEvent(EVENT_NAME, traceEvent);
        return result;

    }

};
