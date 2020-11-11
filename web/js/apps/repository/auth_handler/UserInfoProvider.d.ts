import React from 'react';
import { UserInfo } from "./AuthHandler";
import { Billing } from 'polar-accounts/src/Billing';
interface IUserInfoContext {
    readonly userInfo: UserInfo | undefined;
}
export declare function useUserInfoContext(): IUserInfoContext | undefined;
export declare function useUserSubscriptionContext(): Billing.V2Subscription;
interface IProps {
    readonly children: React.ReactNode;
}
export declare const UserInfoProvider: React.MemoExoticComponent<(props: IProps) => JSX.Element | null>;
export {};
