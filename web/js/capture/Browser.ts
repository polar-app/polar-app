export class Browser {

    public readonly name: string;

    public readonly description: string;

    public readonly userAgent: string;

    public readonly deviceEmulation: Electron.Parameters;

    /**
     *
     * True when the browser should be shown while we are capturing.
     */
    public readonly show = true;

    /**
     *
     * True when we should use the offscreen support in Electron.
     */
    public readonly offscreen = false;

    // TODO: this can just become an interface.
    constructor(opts: any) {

        this.name = opts.name;
        this.description = opts.description;
        this.userAgent = opts.userAgent;
        this.deviceEmulation = opts.deviceEmulation;
        this.show = opts.show;
        this.offscreen = opts.offscreen;

    }

}
