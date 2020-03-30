import {TraceListener} from './TraceListener';
import {MutationType} from './MutationType';
import {TraceEvent} from './TraceEvent';
import {FunctionalInterface} from '../util/FunctionalInterface';

export class TraceListenerExecutor {

    private traceListeners: TraceListener[];

    // TODO: use the proper type in the future once ported to TS.
    private traceHandler: any;

    /**
     * @param traceListeners The specific traceListener we're working with.
     * @param traceHandler The TraceHandler that this traceListener is
     *     registered with.
     */
    constructor(traceListeners: TraceListener[], traceHandler: any) {
        this.traceListeners = traceListeners;
        this.traceHandler = traceHandler;
    }

    /**
     * Synchronize event listeners with the current state of the model.
     *
     * TODO: refactor this to snapshot() as sync() is too generic and could
     * be confused with sync of disk or some other async/synchronous method.
     *
     * TODO: refactor this to take multiple events at once in the onMutation
     *       method.
     */
    public sync() {

        // REFACTOR: this should not be onMutation because the initial value is
        // not a mutation.

        const path = this.traceHandler.path;
        const target = this.traceHandler.target;

        this.traceListeners.forEach(traceListener => {

            traceListener = FunctionalInterface.create("onMutation", traceListener);

            for (const key in target) {

                if (target.hasOwnProperty(key)) {
                    const val = target[key];

                    const traceEvent = new TraceEvent({
                        path,
                        mutationType: MutationType.INITIAL,
                        target,
                        property: key,
                        value: val
                    });

                    traceListener.onMutation(traceEvent);
                }

            }

        });

    }

}
