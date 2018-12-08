"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TraceListenerExecutor_1 = require("./TraceListenerExecutor");
const TraceEvent_1 = require("./TraceEvent");
const Preconditions_1 = require("../Preconditions");
const MutationType_1 = require("./MutationType");
const FunctionalInterface_1 = require("../util/FunctionalInterface");
const Reactor_1 = require("../reactor/Reactor");
const TraceListeners_1 = require("./TraceListeners");
const Paths_1 = require("../util/Paths");
const EVENT_NAME = "onMutation";
class TraceHandler {
    constructor(path, traceListeners, target, traceIdentifier, proxies) {
        this.path = Preconditions_1.Preconditions.assertNotNull(path, "path");
        this.target = Preconditions_1.Preconditions.assertNotNull(target, "target");
        this.traceIdentifier = Preconditions_1.Preconditions.assertNotNull(traceIdentifier, "traceIdentifier");
        this.proxies = Preconditions_1.Preconditions.assertNotNull(proxies, "proxies");
        this.reactor = new Reactor_1.Reactor();
        this.reactor.registerEvent(EVENT_NAME);
        this.addTraceListener(traceListeners);
    }
    addTraceListener(traceListeners, options = {}) {
        traceListeners = TraceListeners_1.TraceListeners.asArray(traceListeners);
        let eventName = EVENT_NAME;
        if (options.property) {
            eventName = `${eventName}:${options.property}`;
        }
        traceListeners.forEach(traceListener => {
            traceListener = FunctionalInterface_1.FunctionalInterface.create(EVENT_NAME, traceListener);
            this.reactor.addEventListener(eventName, (traceEvent) => {
                traceListener.onMutation(traceEvent);
            });
        });
        return new TraceListenerExecutor_1.TraceListenerExecutor(traceListeners, this);
    }
    getTraceListeners() {
        return this.reactor.getEventListeners(EVENT_NAME);
    }
    get(target, property, receiver) {
        switch (property) {
            case "__path":
                return this.path;
            case "__traceIdentifier":
                return this.traceIdentifier;
            case "__traceListeners":
                return this.getTraceListeners();
            default:
                return Reflect.get(target, property, receiver);
        }
    }
    set(target, property, value, receiver) {
        let traceListeners = this.reactor.getEventListeners(EVENT_NAME);
        if (typeof value === "object") {
            let pathPrefix = Paths_1.Paths.create(this.path, property);
            value = this.proxies.create(value, traceListeners, { pathPrefix });
        }
        let previousValue = target[property];
        let result = Reflect.set(target, property, value, receiver);
        let traceEvent = new TraceEvent_1.TraceEvent({
            path: this.path,
            mutationType: MutationType_1.MutationType.SET,
            target,
            property,
            value,
            previousValue
        });
        this.reactor.dispatchEvent(EVENT_NAME, traceEvent);
        return result;
    }
    deleteProperty(target, property) {
        let previousValue = target[property];
        let result = Reflect.deleteProperty(target, property);
        let traceEvent = new TraceEvent_1.TraceEvent({
            path: this.path,
            mutationType: MutationType_1.MutationType.DELETE,
            target,
            property,
            value: undefined,
            previousValue
        });
        this.reactor.dispatchEvent(EVENT_NAME, traceEvent);
        return result;
    }
}
exports.TraceHandler = TraceHandler;
