"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TraceListeners_1 = require("./TraceListeners");
const Objects_1 = require("../util/Objects");
const TraceHandler_1 = require("./TraceHandler");
const ObjectPaths_1 = require("./ObjectPaths");
const Paths_1 = require("../util/Paths");
let sequence = 0;
class Proxies {
    static create(target, traceListeners, opts) {
        if (typeof target !== "object") {
            throw new Error("Only works on objects: " + typeof target);
        }
        opts = Objects_1.Objects.defaults(opts, {
            pathPrefix: ""
        });
        if (!traceListeners) {
            traceListeners = [];
        }
        traceListeners = TraceListeners_1.TraceListeners.asArray(traceListeners);
        let objectPathEntries = ObjectPaths_1.ObjectPaths.recurse(target);
        let root;
        objectPathEntries.forEach((objectPathEntry) => {
            let path = objectPathEntry.path;
            if (opts.pathPrefix && opts.pathPrefix !== "") {
                path = Paths_1.Paths.create(opts.pathPrefix, objectPathEntry.path);
            }
            let proxy = Proxies.trace(path, objectPathEntry.value, traceListeners);
            if (objectPathEntry.parent != null) {
                objectPathEntry.parent[objectPathEntry.parentKey] = proxy;
            }
            else {
                root = proxy;
            }
        });
        return root;
    }
    static trace(path, value, traceListeners) {
        if (typeof value !== "object") {
            throw new Error("We can only trace object types.");
        }
        traceListeners = TraceListeners_1.TraceListeners.asArray(traceListeners);
        if (Object.isFrozen(value)) {
            return value;
        }
        let traceIdentifier = sequence++;
        let traceHandler = new TraceHandler_1.TraceHandler(path, traceListeners, value, traceIdentifier, Proxies);
        let privateMembers = [];
        if (value.addTraceListener) {
            value.addTraceListener(traceListeners);
        }
        else {
            Object.defineProperty(value, "addTraceListener", {
                value: traceHandler.addTraceListener.bind(traceHandler),
                enumerable: false,
                writable: false
            });
        }
        return new Proxy(value, traceHandler);
    }
}
exports.Proxies = Proxies;
