import {Objects} from "../util/Objects";

/**
 * Throttles a set of operations to a max of N operations at once or T
 * milliseconds, whichever happens first.
 */
export class Throttler {

    private readonly delegate: () => void;

    private readonly opts: ThrottlerOpts;

    private nrRequestsOutstanding: number = 0;

    private hasTimeout: boolean = false;

    constructor(delegate: () => void,
                opts: Partial<ThrottlerOpts> = new DefaultThrottlerOpts()) {

        this.delegate = delegate;
        this.opts = Objects.defaults(opts, new DefaultThrottlerOpts());

    }

    /**
     * Exec the delegate function but only based on the
     */
    public exec() {

        ++this.nrRequestsOutstanding;

        if (this.nrRequestsOutstanding > this.opts.maxRequests) {
            this.doExec();
        } else {

            // we might have to setup via the timeout now.

            if (! this.hasTimeout) {
                setTimeout(() => this.doExecViaTimeout(), this.opts.maxTimeout);
                this.hasTimeout = true;
            }

        }

    }

    private doExecViaTimeout() {

        this.doExec();

        this.hasTimeout = false;

    }

    private doExec() {

        if (this.nrRequestsOutstanding === 0) {
            // we have already been executed.
            return;
        }

        this.nrRequestsOutstanding = 0;

        this.delegate();

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
