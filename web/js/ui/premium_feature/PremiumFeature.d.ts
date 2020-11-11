import React from 'react';
import { Billing } from 'polar-accounts/src/Billing';
export declare type UISize = 'xs' | 'sm' | 'md' | 'lg';
interface IProps {
    readonly required: Billing.V2PlanLevel;
    readonly feature: string;
    readonly size: UISize;
    readonly children: React.ReactElement;
}
export declare const PremiumFeature: (props: IProps) => JSX.Element;
export {};
