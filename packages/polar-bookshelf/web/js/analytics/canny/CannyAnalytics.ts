import {IAnalytics, IEventArgs, TraitsMap, IPageEvent, IAnalyticsUser} from "../IAnalytics";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import onlyDefinedProperties = Dictionaries.onlyDefinedProperties;

export class CannyAnalytics implements IAnalytics {

    private cannyClient = createCannyClient();

    private identification: ICannyUserData | undefined = undefined;

    public constructor() {
        // noop
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

        if (! this.cannyClient) {
            console.warn("No Canny client");
            return;
        }

        this.identification = onlyDefinedProperties({
            email: user.email,
            name: user.displayName,
            id: user.uid,
            avatarURL: user.photoURL,
            created: user.created,
            customFields: {}
        });

        if (this.identification) {
            this.cannyClient.identify(this.identification);
        }

    }

    public traits(traits: TraitsMap) {

        if (! this.cannyClient) {
            console.warn("No Canny client");
            return;
        }

        if (this.identification) {

            const newIdentification: ICannyUserData = {
                ...this.identification,
                customFields: {
                    ...this.identification.customFields,
                    ...traits
                }
            }

            this.identification = newIdentification;
            this.cannyClient.identify(this.identification);

        }


    }

    public version(version: string): void {
        // noop
    }

    public heartbeat(): void {
        // noop
    }

    public logout(): void {
        this.identification = undefined;
    }

}

declare var window: any;

export type ICannyCustomFields = {[key: string]: string | number | Date};

export interface ICannyUserData {
    readonly name?: string;
    readonly id: string;
    readonly email: string;
    readonly avatarURL?: string;
    readonly customFields: ICannyCustomFields;
}

export interface ICannyData {
    appID: string;
    user: ICannyUserData
}

export interface ICannyClient {
    readonly identify: (data: ICannyUserData) => void;
}

export function createCannyClient(): ICannyClient | undefined {

    const appID = '6028141fa9c2061014659f73';

    if (window.Canny) {

        function doIdentify(data: ICannyData) {
            window.Canny('identify', data);
        }


        function identify(user: ICannyUserData) {
            doIdentify({
                appID,
                user
            })
        }

        return {identify};
    }

    return undefined;

}
