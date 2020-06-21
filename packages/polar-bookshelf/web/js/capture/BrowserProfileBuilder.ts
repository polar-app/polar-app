import {BrowserProfile, BrowserProfileID} from "./BrowserProfile";
import {DefaultNavigation, Navigation} from "./navigation/Navigation";
import {Browser, BrowserType} from "polar-content-capture/src/capture/Browser";

export class BrowserProfileBuilder implements BrowserProfile {

    public id: BrowserProfileID = BrowserProfileBuilder.sequence++;

    public profile: string = "unknown";

    public description: string;

    public deviceEmulation: Electron.Parameters;

    public name: string;

    public type: BrowserType;

    public title: string;

    public offscreen: boolean = false;

    public show: boolean = true;

    public userAgent: string;

    public nodeIntegration: boolean = false;

    public navigation: Navigation = new DefaultNavigation();

    public useReactor: boolean = true;

    public webaudio: boolean = true;

    public hosted: boolean = false;

    public destroy: boolean = true;

    public inactive: boolean = false;

    /**
     */
    constructor(browser: Browser) {
        this.description = browser.description;
        this.deviceEmulation = browser.deviceEmulation;
        this.name = browser.name;
        this.type = browser.type;
        this.title = browser.title;
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

    public setUseReactor(value: boolean) {
        this.useReactor = value;
        return this;
    }

    public setWebaudio(value: boolean) {
        this.webaudio = value;
        return this;
    }

    public setHosted(value: boolean) {
        this.hosted = value;
        return this;
    }

    public build(): Readonly<BrowserProfile> {
        return Object.freeze(this);
    }

    private static sequence: number = 0;

}
