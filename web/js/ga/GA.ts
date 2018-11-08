import {Preconditions} from '../Preconditions';
import {AppAnalytics} from './AppAnalytics';

const Analytics: IAnalytics = require('electron-google-analytics').default;

// TODO: we MUST specify the userAgent here at some point so we can record the
// OS version but I don't think there is an easy way to get this from the main
// process.

const TRACKING_ID = 'UA-122721184-1';

export class GA {

    public static analytics?: IAnalytics;

    public static getInstance(userAgent: string): IAnalytics {

        Preconditions.assertNotNull(userAgent, "userAgent");

        if (this.analytics === undefined) {
            this.analytics = new Analytics(TRACKING_ID, {userAgent});
        }

        return this.analytics;
    }

    public static getAppAnalytics(userAgent: string) {
        return new AppAnalytics(this.getInstance(userAgent));
    }

}

/**
 * Raw analytics interface.
 */
export interface IAnalytics {

    new(trackingID: string, opts?: IAnalyticsOpts): IAnalytics;

    set(key: string, value: number | string): Promise<IResponse>;

    screen(appName: string,
           appVer: string,
           appID: string,
           appInstallerID: string,
           screenName: string,
           clientID: string): Promise<IResponse>;

    pageview(hostname: string,
             url: string,
             title: string,
             clientID: string): Promise<IResponse>;

}

export interface IResponse {

}

export interface IAnalyticsOpts {
    userAgent?: string;
    debug?: boolean;
    version?: number;
}
