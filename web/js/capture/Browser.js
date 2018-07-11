class Browser {

    constructor(opts) {

        /**
         * @type {string}
         */
        this.name = undefined;

        /**
         * @type {string}
         */
        this.description = undefined;

        /**
         * @type {string}
         */
        this.userAgent = undefined;

        /**
         *
         * @type {Electron.Parameters | Object}
         */
        this.deviceEmulation = undefined;

        Object.assign(this, opts);

    }

}

module.exports.Browser = Browser;
