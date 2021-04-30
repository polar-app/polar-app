import {IAnalytics, IEventArgs, TraitsMap, IPageEvent, IAnalyticsUser} from "../IAnalytics";
import {StandardEventProperties} from "../StandardEventProperties";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

const standardEventProperties = StandardEventProperties.create();

export class IntercomAnalytics implements IAnalytics {

    private intercomClient = createIntercomClient();

    private user: IAnalyticsUser | undefined = undefined;

    public constructor() {
        this.boot(toIntercomData(undefined));
    }

    public event(evt: IEventArgs) {
        // noop
    }

    public event2(event: string, data?: any): void {
        // noop
    }

    public page(event: IPageEvent) {
        // noop
    }

    public identify(user: IAnalyticsUser) {
        this.user = user;

        this.boot(toIntercomData(this.user));

    }

    public traits(traits: TraitsMap) {

        const intercomData = toIntercomData(this.user);

        if (! intercomData) {
            console.warn("No intercom data");
            return;
        }

        const data: IntercomData = {
            ...intercomData,
            ...traits,
            ...standardEventProperties
        };

        this.update(data);

    }

    public version(version: string): void {
        // noop
    }

    public heartbeat(): void {
        // noop
    }

    public logout(): void {
        this.user = undefined;
        this.boot(toIntercomData(undefined));
    }

    private boot(intercomData: IntercomData | undefined) {

        if (! this.intercomClient) {
            console.warn("No intercom client");
            return;
        }

        if (! intercomData) {
            console.warn("No intercom data");
            return;
        }

        this.intercomClient.boot(intercomData);

    }

    private update(intercomData: IntercomData | undefined) {

        if (! this.intercomClient) {
            console.warn("No intercom client");
            return;
        }

        if (! intercomData) {
            console.warn("No intercom data");
            return;
        }

        this.intercomClient.update(intercomData);

    }

}

export interface IIntercomDataForAnonymousUser {
    readonly app_id: string;

    // now arbitrary key / value pairs for attributes.
    [key: string]: string | number;

}

export interface IIntercomDataForAuthenticatedUser extends IIntercomDataForAnonymousUser {

    readonly user_id: string;
    readonly name: string;
    readonly email: string;
    readonly created_at: string;

}

export type IntercomData = IIntercomDataForAnonymousUser | IIntercomDataForAuthenticatedUser;

export interface IIntercomClient {
    readonly boot: (data: IntercomData) => void;
    readonly update: (data: IntercomData) => void;
}

declare var window: any;

export function createIntercomClient(): IIntercomClient | undefined {

    if (window.Intercom) {

        function boot(data: IntercomData) {
            window.Intercom('boot', data);
        }

        function update(data: IntercomData) {
            window.Intercom('update', data);

        }

        return {boot, update};
    }

    return undefined;

}

export function toIntercomData(user: IAnalyticsUser | undefined): IntercomData {

    // tslint:disable-next-line:variable-name
    const app_id = "wk5j7vo0";

    if (! user) {
        return {app_id};
    }

    // tslint:disable-next-line:variable-name
    const created_at = Math.floor(ISODateTimeStrings.parse(user.created).getTime() / 1000);

    const data: IIntercomDataForAuthenticatedUser = {
        app_id,
        user_id: user.uid,
        name: user.displayName || "",
        email: user.email,
        created_at: `${created_at}`
    };

    return data;

}
