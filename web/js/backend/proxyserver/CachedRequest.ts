export class CachedRequest {

    /**
     */
    public url: string;

    /**
     */
    public proxyRules: string;

    /**
     */
    public proxyBypassRules: string;

    /**
     */
    constructor(opts: any) {

        this.url = opts.url;
        this.proxyRules = opts.proxyRules;
        this.proxyBypassRules = opts.proxyBypassRules;

        Object.assign(this, opts);

    }

}
