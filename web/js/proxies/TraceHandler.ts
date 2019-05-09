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
import {Dictionaries} from '../util/Dictionaries';

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

        this.path = Preconditions.assertPresent(path, "path");
        this.target = Preconditions.assertPresent(target, "target");
        this.traceIdentifier = Preconditions.assertPresent(traceIdentifier, "traceIdentifier");
        this.proxies = Preconditions.assertPresent(proxies, "proxies");

        this.reactor = new Reactor();
        this.reactor.registerEvent(EVENT_NAME);
        this.addTraceListener(traceListeners);

    }

    /**
     * Add a listener to a specific object. By default we return all events but
     * you can also narrow it down to a specific property by specifying a given
     * property to monitor.
     */
    public addTraceListener(traceListeners: TraceListener | TraceListener[], options: any = {}) {

        const traceListenerArray: TraceListener[]
            = <TraceListener[]> [...TraceListeners.asArray(traceListeners)];

        let eventName = EVENT_NAME;

        if (options.property) {
            eventName = `${eventName}:${options.property}`;
        }

        traceListenerArray.forEach(traceListener => {

            traceListener = FunctionalInterface.create(EVENT_NAME, traceListener);

            this.reactor.addEventListener(eventName, (traceEvent: TraceEvent) => {
                traceListener.onMutation(traceEvent);
            });

        });

        return new TraceListenerExecutor(traceListenerArray, this);

    }

    public getTraceListeners() {
        return this.reactor.getEventListeners(EVENT_NAME);
    }

    public removeTraceListeners() {

        if (this.reactor) {
            console.log("FIXME: clearing event.");
            this.reactor.clearEvent(EVENT_NAME);
        }

    }

    public get(target: any, property: string, receiver: any) {

        switch (property) {

            // provide some default / hidden fields that can be used for debug
            // reasons.

            case "__path":
                return this.path;

            case "__traceIdentifier":
                return this.traceIdentifier;

            case "__traceListeners":
                return this.getTraceListeners();

            case "__removeTraceListeners":
                return this.removeTraceListeners.bind(this);

            default:
                return Reflect.get(target, property, receiver);
        }

    }

    public set(target: any, property: string, value: any, receiver: any) {

        console.log("FIXME: got a set at: " + this.path);

        value = Dictionaries.deepCopy(value);

        // TODO: before we change the value, also trace the new input values
        // if we are given an object.

        const traceListeners = this.reactor.getEventListeners(EVENT_NAME);

        if (typeof value === "object") {

            // we have to proxy this object since it would mean adding a new
            // sub-graph that isn't traced.

            const pathPrefix = Paths.create(this.path, property);

            value = (<any> this.proxies).create(value, traceListeners, {pathPrefix});

        }

        const previousValue = target[property];

        const result = Reflect.set(target, property, value, receiver);

        const traceEvent = new TraceEvent({
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

    public deleteProperty(target: any, property: string) {

        const previousValue = target[property];

        const result = Reflect.deleteProperty(target, property);

        const traceEvent = new TraceEvent({
            path: this.path,
            mutationType: MutationType.DELETE,
            target,
            property,
            value: undefined,
            previousValue
        });

        this.reactor.dispatchEvent(EVENT_NAME, traceEvent);

        // FIXME: there is another main issue here... if we copy the same object
        // into two places... we should duplicate it by copying it deep without
        // the proxy object...

        // /**
        //  * We have to delete all the keys on this object manually as proxies
        //  * will remain otherwise
        //  */
        // const deactivateTraceListeners = (obj: any) => {
        //
        //     // FIXME: we have to do this recursively...
        //
        //     if (! obj) {
        //         return;
        //     }
        //
        //     if (obj.__removeTraceListeners) {
        //         console.log("FIXME3 __removeTraceListeners");
        //         obj.__removeTraceListeners();
        //     }
        //
        //     for (const key of Object.keys(obj)) {
        //         deactivateTraceListeners(obj[key]);
        //     }
        //
        // };
        //
        // deactivateTraceListeners(previousValue);

        /**
         * We have to delete all the keys on this object manually as proxies
         * will remain otherwise
         */
        // const garbageCollect = (obj: any) => {
        //
        //     if (! obj) {
        //         return;
        //     }
        //
        //     if (typeof obj !== 'object') {
        //         return;
        //     }
        //
        //     for (const key of Object.keys(obj)) {
        //         delete obj[key];
        //     }
        //
        // };
        //
        // garbageCollect(previousValue);

        return result;

    }

}
