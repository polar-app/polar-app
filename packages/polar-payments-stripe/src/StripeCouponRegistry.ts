import {StripeMode} from "./StripeUtils";

export interface IStripeCoupon {
    readonly id: string;
}

export interface IStripeCouponRegistry {

    /**
     * Give the user one free month, one time.
     */
    readonly ONE_MONTH_FREE: IStripeCoupon;
}


export namespace StripeCouponRegistry {

    const registry: {[mode in StripeMode]: IStripeCouponRegistry} = {
        test: {
            ONE_MONTH_FREE: {
                id: '12345',
            }
        },
        live: {
            ONE_MONTH_FREE: {
                id: '23456',
            }
        }

    }

    export function get(mode: StripeMode): IStripeCouponRegistry {
        return registry[mode];
    }

}
