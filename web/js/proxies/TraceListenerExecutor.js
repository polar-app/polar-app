const {FunctionalInterface} = require("../util/FunctionalInterface");
const {TraceEvent} = require("./TraceEvent");
const {MutationType} = require("./MutationType");

module.exports.TraceListenerExecutor = class {

    /**
     * @param traceListeners The specific traceListener we're working with.
     * @param traceHandler The TraceHandler that this traceListener is registered with.
     */
    constructor(traceListeners, traceHandler) {
        this.traceListeners = traceListeners;
        this.traceHandler = traceHandler;
    }

    /**
     * Fire the initial values on this object.
     */
    fireInitial() {

        // REFACTOR: this should not be onMutation because the initial value is
        // not a mutation.

        let path = this.traceHandler.path;
        let target = this.traceHandler.target;

        this.traceListeners.forEach(traceListener => {

            traceListener = FunctionalInterface.create("onMutation", traceListener);

            for (let key in target) {

                if (target.hasOwnProperty(key)) {
                    let val = target[key];
                    traceListener.onMutation(new TraceEvent(path, MutationType.INITIAL, target, key, val));
                }

            }

        });

    }

};
