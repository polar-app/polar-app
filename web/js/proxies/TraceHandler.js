const {TraceListenerExecutor} = require("./TraceListenerExecutor");
const {TraceEvent} = require("./TraceEvent");
const {Preconditions} = require("../Preconditions");
const {MutationType} = require("./MutationType");
const {FunctionalInterface} = require("../util/FunctionalInterface");
const {Reactor} = require("../reactor/Reactor");
const {TraceListeners} = require("./TraceListeners");
const {Paths} = require("../util/Paths");

const EVENT_NAME = "onMutation";

class TraceHandler {

    /**
     *
     * @param path {string} The path to this object.
     *
     * @param traceListeners {Array<TraceListener>} The main TraceListener
     *
     * @param target {Object} The object that is the target of this handler.
     *
     * @param proxies {Proxies} class for creating new traced objects.
     * Referenced here to avoid cyclical dependencies.
     */
    constructor(path, traceListeners, target, proxies) {

        this.path = Preconditions.assertNotNull(path, "path");
        this.target = Preconditions.assertNotNull(target, "target");
        this.proxies = Preconditions.assertNotNull(proxies, "proxies");

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

    get(target, property, receiver) {

        if(property === "__path") {
            return this.path;
        }

        return Reflect.get(...arguments);

    }

    set(target, property, value, receiver) {

        // TODO: before we change the value, also trace the new input values
        // if we are given an object.

        let traceListeners = this.reactor.getEventListeners(EVENT_NAME);

        if(typeof value === "object") {

            // we have to proxy this object since it would mean adding a new
            // sub-graph that isn't traced.

            let pathPrefix = Paths.create(this.path, property);

            value = this.proxies.create(value, traceListeners, {pathPrefix});

        }

        let previousValue = target[property];

        let result = Reflect.set(target, property, value, receiver);
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

module.exports.TraceHandler = TraceHandler;
