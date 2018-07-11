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

        /**
         *
         * @type {boolean} True when the browser should be shown while we are capturing.
         */
        this.show = true;

        /**
         *
         * @type {boolean} True when we should use the offscreen support in Electron.
         */
        this.offscreen = false;

        Object.assign(this, opts);

    }

}

module.exports.Browser = Browser;
