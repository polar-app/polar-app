import {V2Plan} from "./V2Plan";
import {Customer} from "./Customer";

export type Account = {
    readonly id: string,
    readonly uid: string,
    readonly email: string,
    readonly plan: V2Plan,
    readonly interval: "month",
    readonly customer: Customer,
    readonly lastModified: string,
    readonly expiresAt?: string,
};
