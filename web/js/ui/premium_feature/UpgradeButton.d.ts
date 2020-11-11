import React from "react";
import { Billing } from "polar-accounts/src/Billing";
interface IProps {
    readonly required: Billing.V2PlanLevel;
    readonly feature: string;
}
export declare const UpgradeButton: React.MemoExoticComponent<(props: IProps) => JSX.Element>;
export {};
