export class PostMessageRequest {


    /**
     * The BrowserWindow running the app to receive the message.
     */
    public readonly window?: Electron.BrowserWindow | null | undefined;

    /**
     * The message to send the remote window.
     */
    public readonly message: any;

    /**
     *
     */
    constructor(opts: any) {
        this.window = opts.window;
        this.message = opts.message;
    }

}
