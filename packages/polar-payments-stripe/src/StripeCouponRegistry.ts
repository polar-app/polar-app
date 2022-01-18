import {StripeMode} from "./StripeUtils";

export interface IStripeCoupon {
    readonly id: string;
}

export interface IStripeCouponRegistry {

    /**
     * Give the user one free month, one time.
     */
    readonly PLUS_ONE_MONTH_FREE: IStripeCoupon;

    /**
     * Give the user one free month, one time.
     */
    readonly PRO_ONE_MONTH_FREE: IStripeCoupon;

}


export namespace StripeCouponRegistry {

    const registry: {[mode in StripeMode]: IStripeCouponRegistry} = {
        test: {
            PLUS_ONE_MONTH_FREE: {
                id: 'WUBFIAnh',
            },
            PRO_ONE_MONTH_FREE: {
                id: "ppX1ONK4"
            }
        },
        // FIXME these live codes are wrong.
        live: {
            PLUS_ONE_MONTH_FREE: {
                id: '23456',
            },
            PRO_ONE_MONTH_FREE: {
                id: "ppX1ONK4"
            }
        }

    }

    export function get(mode: StripeMode): IStripeCouponRegistry {
        return registry[mode];
    }

}
