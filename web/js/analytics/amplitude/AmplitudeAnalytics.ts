import {IAnalytics, IEventArgs, TraitsMap, IPageEvent} from "../IAnalytics";
import {Analytics} from "../Analytics";
import {Platforms, PlatformStr} from "polar-shared/src/util/Platforms";
import {Version} from "polar-shared/src/util/Version";
import { AppRuntime, AppRuntimeID } from "polar-shared/src/util/AppRuntime";
import {Device, Devices} from "polar-shared/src/util/Devices";

function isBrowser() {
    return typeof window !== 'undefined';
}

function createAmplitude(): any {

    if (isBrowser()) {
        const amplitude = require('amplitude-js');

        amplitude.getInstance().init("c1374bb8854a0e847c0d85957461b9f0", null, {
            sameSiteCookie: "Lax",
            domain: ".getpolarized.io",
            includeUtm: true,
            includeReferrer: true,
            saveEvents: true,
        });

        return amplitude;

    }

}

interface StandardEventProperties {

    readonly platform: PlatformStr;
    readonly runtime: AppRuntimeID;
    readonly device: Device;

    readonly version_major: string;
    readonly version_minor: string;
    readonly version: string;

    readonly hostname: string;

}

function createStandardEventsProperties(): StandardEventProperties {

    const platform = Platforms.toSymbol(Platforms.get());
    const version = Version.tokenized();
    const runtime = AppRuntime.get();
    const device = Devices.get();
    const hostname = document.location.hostname;

    return {platform, ...version, runtime, device, hostname};

}

// TODO session variables...

const amplitude = createAmplitude();
const standardEventProperties = createStandardEventsProperties();

export class AmplitudeAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {
        amplitude.getInstance().logEvent(event.category + '/' + event.action);
    }

    public event2(event: string, data?: any): void {
        amplitude.getInstance().logEvent(event, {data, ...standardEventProperties});
    }

    public identify(userId: string): void {
        amplitude.getInstance().setUserId(userId);
    }

    public page(event: IPageEvent): void {
        amplitude.getInstance().logEvent('pageView', event);
    }

    public traits(traits: TraitsMap): void {
        amplitude.getInstance().setUserProperties(traits);
    }

    // TODO: make this a method
    public version(version: string) {
        amplitude.getInstance().setVersionName(version);
    }

    public heartbeat(): void {
        Analytics.event2('heartbeat');
    }

}


