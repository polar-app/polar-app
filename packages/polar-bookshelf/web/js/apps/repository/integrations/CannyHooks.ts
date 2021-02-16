declare var window: any;

export type ICannyUserData = {[key: string]: string | number | Date};

export interface ICannyData {
    appID: string;
    user: ICannyUserData
}

export interface ICannyClient {
    readonly update: (data: ICannyUserData) => void;
}

// https://developers.canny.io/install
export function useCannyClient(): ICannyClient | undefined {

    if (window.Canny) {

        function doUpdate(data: ICannyData) {
            window.Canny('identify', data);
        }

        function update(user: ICannyUserData) {
            doUpdate({
                appID: '6028141fa9c2061014659f73',
                user
            })
        }

        return {update};
    }

    return undefined;

}
