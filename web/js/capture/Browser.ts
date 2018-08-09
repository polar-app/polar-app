export class Browser {

    public readonly name: string;

    public readonly description: string;

    public readonly userAgent: string;

    public readonly deviceEmulation: Electron.Parameters;

    public readonly show = true;

    public readonly offscreen = false;

    constructor(opts: any) {

        this.name = opts.name;
        this.description = opts.description;
        this.userAgent = opts.userAgent;
        this.deviceEmulation = opts.deviceEmulation;
        this.show = opts.show;
        this.offscreen = opts.offscreen;

        Object.assign(this, opts);

    }

}
