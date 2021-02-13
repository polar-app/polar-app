/* tslint:disable:no-var-keyword prefer-const */
import * as React from 'react';
import {useUserInfoContext} from "./auth_handler/UserInfoProvider";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import { useLocation } from 'react-router-dom';
import { useZenModeStore } from '../../mui/ZenModeStore';

declare var window: any;

export interface IIntercomData {
    readonly app_id: string;
    readonly user_id: string;
    readonly name: string;
    readonly email: string;
    readonly created_at: string;
}

export interface IIntercomClient {
    readonly boot: (data: IIntercomData) => void;
    readonly update: (data: IIntercomData) => void;
}

export function useIntercomClient(): IIntercomClient | undefined {

    if (window.Intercom) {

        function boot(data: IIntercomData) {
            window.Intercom('boot', data);
        }

        function update(data: IIntercomData) {
            window.Intercom('update', data);

        }

        return {boot, update};
    }

    return undefined;

}
