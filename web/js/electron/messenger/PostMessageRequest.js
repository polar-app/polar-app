class PostMessageRequest {

    /**
     *
     */
    constructor(opts) {

        /**
         * The BrowserWindow running the app to receive the message.
         *
         * @type {Electron.BrowserWindow}
         */
        this.window = undefined;

        /**
         * The message to send the remote window.
         *
         * @type {Object}
         */
        this.message = undefined;

        Object.assign(this, opts);

    }

}

module.exports.PostMessageRequest = PostMessageRequest;
