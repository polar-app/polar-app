import { ISODateTimeString } from "polar-shared/src/metadata/ISODateTimeStrings";
import { Billing } from 'polar-accounts/src/Billing';
export interface AccountUsage {
    readonly storageInBytes: number;
}
export interface AccountInit {
    readonly plan: Billing.Plan;
    readonly interval?: Billing.Interval;
}
export interface Account extends AccountInit {
    readonly id: string;
    readonly uid: string;
    readonly email: string;
    readonly lastModified: ISODateTimeString;
}
export declare namespace AccountPlans {
}
