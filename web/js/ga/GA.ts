import {Preconditions} from '../Preconditions';
import {AppAnalytics} from './AppAnalytics';

const Analytics: IAnalytics = require('electron-google-analytics').default;

// TODO: we MUST specify the userAgent here at some point so we can record the
// OS version but I don't think there is an easy way to get this from the main
// process.

export class GA {

    static analytics?: IAnalytics;

    static getInstance(userAgent: string) {

        Preconditions.assertNotNull(userAgent, "userAgent");

        if(this.analytics === undefined) {
            this.analytics = new Analytics('UA-122721184-1', {userAgent});
        }

        return this.analytics;
    }

    static getAppAnalytics(userAgent: string) {
        return new AppAnalytics(this.getInstance(userAgent));
    }

}

export interface IAnalytics {

    new(trackingID: string, opts?: IAnalyticsOpts): IAnalytics;

    screen(appName: string,
           appVer: string,
           appID: string,
           appInstallerID: string,
           screenName: string,
           clientID: string): Promise<IResponse>;

}

export interface IResponse {

}

export interface IAnalyticsOpts {
    userAgent?: string;
    debug?: boolean;
    version?: number;
}
