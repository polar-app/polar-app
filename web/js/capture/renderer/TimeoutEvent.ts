
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

    constructor(opts: any) {
        Object.assign(this, opts);
    }

}
