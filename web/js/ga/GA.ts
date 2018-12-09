import {Preconditions} from '../Preconditions';
import {AppAnalytics} from './AppAnalytics';

const Analytics: IAnalytics = require('electron-google-analytics').default;


const TRACKING_ID = 'UA-122721184-1';

// We use the userAgent here at some point so we can record the OS version but I
// don't think there is an easy way to get this from the main process unless we
// are pre-initialized.
let USER_AGENT: string | undefined;

export class GA {

    public static analytics?: IAnalytics;

    public static getInstance(): IAnalytics {

        Preconditions.assertNotNull(USER_AGENT, "USER_AGENT");

        if (this.analytics === undefined) {
            this.analytics = new Analytics(TRACKING_ID, {userAgent: USER_AGENT});
        }

        return this.analytics;
    }

    public static getAppAnalytics() {
        return new AppAnalytics(this.getInstance());
    }

    public static setUserAgent(userAgent: string) {
        USER_AGENT = userAgent;
    }

}

/**
 * Raw analytics interface.
 */
export interface IAnalytics {

    new(trackingID: string, opts?: IAnalyticsOpts): IAnalytics;

    set(key: string, value: number | string): void;

    screen(appName: string,
           appVer: string,
           appID: string,
           appInstallerID: string,
           screenName: string,
           clientID: string): Promise<IResponse>;

    event(category: string, action: string, eventData?: IEventData, clientID?: string): Promise<IResponse>;

    pageview(hostname: string,
             url: string,
             title: string,
             clientID: string): Promise<IResponse>;

}

export interface IEventData {
    readonly evLabel: string;
    readonly evValue: number;
}

export interface IResponse {

}

export interface IAnalyticsOpts {
    userAgent?: string;
    debug?: boolean;
    version?: number;
}
