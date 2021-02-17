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

// https://developers.canny.io/install
export function useCannyClient(): ICannyClient | undefined {

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
