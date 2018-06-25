/**
 * Framework to create listeners to watch changes in dictionaries.  We can
 * change these into observables if we want by making them streams of SET and
 * DELETE operations but since we're not really using RxJS or anything of the
 * sort yet our options are open.
 *
 * Note that Object.observe and other changes were apparently never ratified
 * so we have to use Proxy objects to implement this functionality.
 */
const {ProxyBuilder} = require("./ProxyBuilder");
const {TraceListeners} = require("./TraceListeners");
const {Objects} = require("../util/Objects");
const {TraceHandler} = require("./TraceHandler");
const {ObjectPaths} = require("./ObjectPaths");

/**
 * A sequence identifier generator so that we can assign objects a unique value
 * while we're enumerating them.
 */
let sequence = 0;

class Proxies {

    /**
     * Deeply trace the given object and call back on the traceListener every time
     * we notice a mutation.  The trace listener receives the following arguments:
     *
     *
     */
    static create(target, traceListeners, opts) {

        if(typeof target !== "object") {
            throw new Error("Only works on objects: " + typeof target);
        }

        opts = Objects.defaults(opts, {
            pathPrefix: ""
        });

        if (!traceListeners) {
            traceListeners = [];
        }

        traceListeners = TraceListeners.asArray(traceListeners);

        let objectPathEntries = ObjectPaths.recurse(target);

        let root = null;

        objectPathEntries.forEach(function (objectPathEntry) {

            let proxy = Proxies.trace(opts.pathPrefix + objectPathEntry.path, objectPathEntry.value, traceListeners);

            // replace the object key in the parent with a new object that is
            // traced.
            if(objectPathEntry.parent != null) {
                objectPathEntry.parent[objectPathEntry.parentKey] = proxy;
            } else {
                root = proxy;
            }

        });

        return root;

    }

    static trace(path, value, traceListeners) {

        if(typeof value !== "object") {
            throw new Error("We can only trace object types.");
        }

        traceListeners = TraceListeners.asArray(traceListeners);

        if(Object.isFrozen(value)) {
            // Do not handle frozen objects but might have to in the future for
            // the initial value.
            return value;
        }

        let traceHandler = new TraceHandler(path, traceListeners, value);

        if(!value.__traceIdentifier) {

            // the __traceIdentifier is a unique key for the object which we use
            // to identify which one is being traced.  This way we essentially
            // have a pointer we can use to work with the object directly.

            Object.defineProperty(value, "__traceIdentifier", {
                value: sequence++,
                enumerable: false,
                writable: false
            });

        }

        if(!value.__traceListeners) {

            // keep the traceListener registers with the object so that I can
            // verify that the object we're working with is actually being used
            // with the same trace and not being re-traced by something else.

            Object.defineProperty(value, "__traceListeners", {
                value: traceListeners,
                enumerable: false,
                writable: false
            });

        }

        if(value.addTraceListener) {
            value.addTraceListener(traceListeners);
        } else {
            Object.defineProperty(value, "addTraceListener", {
                value: traceHandler.addTraceListener.bind(traceHandler),
                enumerable: false,
                writable: false
            });
        }

        return new Proxy(value, traceHandler);

    }

}

module.exports.Proxies = Proxies;
