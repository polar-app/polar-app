import {Proxies} from "./Proxies";

import {TraceListenerExecutor} from "./TraceListenerExecutor";
import {TraceEvent} from "./TraceEvent";
import {Preconditions} from "../Preconditions";
import {MutationType} from "./MutationType";
import {FunctionalInterface} from "../util/FunctionalInterface";
import {Reactor} from "../reactor/Reactor";
import {TraceListeners} from "./TraceListeners";
import {Paths} from "../util/Paths";
import {TraceListener} from './TraceListener';

const EVENT_NAME = "onMutation";

export class TraceHandler {

    private readonly path: string;
    private readonly target: any;
    private readonly traceIdentifier: number;

    private readonly proxies: Proxies;

    // @ts-ignore
    private readonly reactor: Reactor;

    /**
     *
     * @param path The path to this object.
     *
     * @param traceListeners The main TraceListener
     *
     * @param target The object that is the target of this handler.
     *
     * @param traceIdentifier {number} A unique identifier for this handler.
     *
     * @param proxies {Proxies} class for creating new traced objects.
     * Referenced here to avoid cyclical dependencies.
     */
    constructor(path: string,
                traceListeners: TraceListener[],
                target: any,
                traceIdentifier: number,
                proxies: Proxies) {

        this.path = Preconditions.assertNotNull(path, "path");
        this.target = Preconditions.assertNotNull(target, "target");
        this.traceIdentifier = Preconditions.assertNotNull(traceIdentifier, "traceIdentifier");
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
    addTraceListener(traceListeners: TraceListener[], options: any = {}) {

        traceListeners = TraceListeners.asArray(traceListeners);

        let eventName = EVENT_NAME;

        if(options.property) {
            eventName = `${eventName}:${options.property}`;
        }

        traceListeners.forEach(traceListener => {

            traceListener = FunctionalInterface.create(EVENT_NAME, traceListener);

            this.reactor.addEventListener(eventName, (traceEvent: TraceEvent) => {
                traceListener.onMutation(traceEvent);
            });

        });

        return new TraceListenerExecutor(traceListeners, this);

    }

    getTraceListeners() {
        return this.reactor.getEventListeners(EVENT_NAME);
    }

    get(target: any, property: string, receiver: any) {

        switch(property) {

            // provide some default / hidden fields that can be used for debug
            // reasons.

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

    set(target: any, property: string, value: any, receiver: any) {

        // TODO: before we change the value, also trace the new input values
        // if we are given an object.

        let traceListeners = this.reactor.getEventListeners(EVENT_NAME);

        if(typeof value === "object") {

            // we have to proxy this object since it would mean adding a new
            // sub-graph that isn't traced.

            let pathPrefix = Paths.create(this.path, property);

            value = (<any> this.proxies).create(value, traceListeners, {pathPrefix});

        }

        let previousValue = target[property];

        let result = Reflect.set(target, property, value, receiver);

        let traceEvent = new TraceEvent({
            path: this.path,
            mutationType: MutationType.SET,
            target,
            property,
            value,
            previousValue
        });

        this.reactor.dispatchEvent(EVENT_NAME, traceEvent);
        return result;

    }

    deleteProperty(target: any, property: string) {

        let previousValue = target[property];

        let result = Reflect.deleteProperty(target, property);

        let traceEvent = new TraceEvent({
            path: this.path,
            mutationType: MutationType.DELETE,
            target,
            property,
            value: undefined,
            previousValue
        });

        this.reactor.dispatchEvent(EVENT_NAME, traceEvent);
        return result;

    }

}
