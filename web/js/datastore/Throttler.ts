import {Objects} from "../util/Objects";

/**
 * Throttles a set of operations to a max of N operations at once or T
 * milliseconds, whichever happens first.
 */
export class Throttler {

    private readonly delegate: () => void;

    private readonly opts: ThrottlerOpts;

    private nrRequestsOutstanding: number = 0;

    private timeout?: TimeoutID;

    private lastExecuted: number = 0;

    constructor(delegate: () => void,
                opts: Partial<ThrottlerOpts> = new DefaultThrottlerOpts()) {

        this.delegate = delegate;
        this.opts = Objects.defaults(opts, new DefaultThrottlerOpts());

    }

    /**
     * Exec the delegate function but only execute if the timeout has expired
     * or the maxium number of operations has passed.
     */
    public exec() {

        ++this.nrRequestsOutstanding;

        if (this.nrRequestsOutstanding > this.opts.maxRequests) {
            this.doExec();
        } else {

            // we might have to setup via the timeout now.

            if (this.timeout === undefined) {

                this.timeout =
                    window.setTimeout(() => this.doExecViaTimeout(), this.opts.maxTimeout);

            }

        }

    }

    private doExecViaTimeout() {

        this.doExec();

        this.timeout = undefined;

    }

    private doExec() {

        if (this.nrRequestsOutstanding === 0) {
            // we have already been executed so we're done now.
            return;
        }

        try {

            // this.trace();

            this.delegate();

        } finally {

            if (this.timeout !== undefined) {
                window.clearTimeout(this.timeout);
                this.timeout = undefined;
            }

            this.nrRequestsOutstanding = 0;
        }

    }

    private trace() {

        const now = Date.now();

        const delta = Math.floor(now - this.lastExecuted);

        this.lastExecuted = now;

    }

}

export interface ThrottlerOpts {

    /**
     * The max number of operations until we execute.
     */
    readonly maxRequests: number;

    /**
     * The max time until we execute.
     */
    readonly maxTimeout: number;

}

class DefaultThrottlerOpts implements ThrottlerOpts {
    public readonly maxRequests = 50;
    public readonly maxTimeout = 250;
}

export type TimeoutID = number;
