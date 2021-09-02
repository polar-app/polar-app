import {V2Plan} from "./V2Plan";
import {Customer} from "./Customer";

export type Account = {
    id: string,
    uid: string,
    email: string,
    plan: V2Plan,
    interval: "month",
    customer: Customer,
    lastModified: string,
    expiresAt?: string,
};
