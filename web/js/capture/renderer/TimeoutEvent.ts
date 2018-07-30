
/**
 *
 */
export class TimeoutEvent {

    /**
     * The total pending number of timeouts.
     */
    pending: number = 0;

    /**
     * The timeout for this registered callback.
     */
    timeout: number = 0;

    constructor(opts: any) {
        Object.assign(this, opts);
    }

}
