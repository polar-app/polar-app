import {BrowserProfile} from './BrowserProfile';

export class Browser implements Readonly<IBrowser> {

    public readonly name: string;

    public readonly description: string;

    public readonly userAgent: string;

    public readonly deviceEmulation: Electron.Parameters;


    // TODO: this can just become an interface but the default values are the
    // problem
    constructor(opts: any) {
        this.name = opts.name;
        this.description = opts.description;
        this.userAgent = opts.userAgent;
        this.deviceEmulation = opts.deviceEmulation;
    }

}

export interface IBrowser {

    name: string;

    description: string;

    userAgent: string;

    deviceEmulation: Electron.Parameters;

}

export class BrowserProfileBuilder implements BrowserProfile {

    private profile: string = "unknown";
    private description: string;
    private deviceEmulation: Electron.Parameters;
    private name: string;
    private offscreen: boolean = false;
    private show: boolean = true;
    private userAgent: string;
    private nodeIntegration: boolean = false;
    private webContentsId?: number;

    /**
     */
    constructor(browser: Browser) {
        this.description = browser.description;
        this.deviceEmulation = browser.deviceEmulation;
        this.name = browser.name;
        this.userAgent = browser.userAgent;
    }

    public setHeight(height: number) {

        this.deviceEmulation.screenSize.height = height;
        this.deviceEmulation.viewSize.height = height;

        return this;

    }

    public setShow(show: boolean) {
        this.show = show;
        return this;
    }

    public setOffscreen(offscreen: boolean) {
        this.offscreen = offscreen;
        return this;
    }

    public setProfile(profile: string) {
        this.profile = profile;
        return this;
    }

    public setNodeIntegration(value: boolean) {
        this.nodeIntegration = value;
        return this;
    }

    public setWebContentsId(webContentsId?: number) {
        this.webContentsId = webContentsId;
        return this;
    }

    public build(): Readonly<BrowserProfile> {
        return Object.freeze(this);
    }

}
