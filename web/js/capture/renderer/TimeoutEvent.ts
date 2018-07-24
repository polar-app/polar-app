
/**
 *
 */
export class TimeoutEvent {

    /**
     * The total pending number of timeouts.
     */
    pending: string;

    /**
     * The timeout for this registered callback.
     */
    timeout: number;

    constructor(opts) {
        Object.assign(this, opts);
    }

}
