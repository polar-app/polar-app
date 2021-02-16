/* tslint:disable:no-var-keyword prefer-const */
import * as React from 'react';
import {useUserInfoContext} from "../auth_handler/UserInfoProvider";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import { useLocation } from 'react-router-dom';
import { useZenModeStore } from '../../../mui/ZenModeStore';

declare var window: any;

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

export function useIntercomClient(): IIntercomClient | undefined {

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

export function useIntercomData(): IntercomData | undefined {

    const context = useUserInfoContext();

    const userInfo = context?.userInfo;

    // tslint:disable-next-line:variable-name
    const app_id = "wk5j7vo0";

    if (! userInfo) {
        return {app_id};
    }

    // tslint:disable-next-line:variable-name
    const created_at = Math.floor(ISODateTimeStrings.parse(userInfo.creationTime).getTime() / 1000);

    const data: IIntercomDataForAuthenticatedUser = {
        app_id,
        user_id: userInfo.uid,
        name: userInfo?.displayName || "",
        email: userInfo?.email,
        created_at: `${created_at}`
    };

    return data;
}
