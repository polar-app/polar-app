
/**
 * Like a mutation listener, but we also include a 'path' to the object that
 * represents the target that is being mutated.  This way we proxy deep objects,
 * replacing their objects with proxies if necessary.
 *
 * @constructor
 */
class TraceListener {

    /**
     * Listen to a mutation and we're given a list of names and types.
     * @param traceEvent a TraceEvent that we're watching.
     */
    onMutation(traceEvent) {

    }

};

module.exports.TraceListener = TraceListener;
