class CachedRequest {

    /**
     */
    constructor(options) {

        /**
         * @type {String}
         */
        this.url = null;

        /**
         * @type {String}
         */
        this.proxyRules = null;

        /**
         * @type {String}
         */
        this.proxyBypassRules = null;

        Object.assign(this, options);

    }

}

module.exports.CachedRequest = CachedRequest;
