class TraceListeners {

    /**
     * Convert this to an array so that we're always working with an array.
     *
     * @param traceListeners
     */
    static asArray(traceListeners) {

        if(! traceListeners) {
            return [];
        }

        if(! Array.isArray(traceListeners)) {
            return [traceListeners];
        }

        return traceListeners;

    }

}

module.exports.TraceListeners = TraceListeners;
