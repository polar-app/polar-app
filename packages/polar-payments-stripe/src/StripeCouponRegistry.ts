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
        live: {
            PLUS_ONE_MONTH_FREE: {
                id: 'Aez57GHJ',
            },
            PRO_ONE_MONTH_FREE: {
                id: "TAgmdASE"
            }
        }

    }

    export function get(mode: StripeMode): IStripeCouponRegistry {
        return registry[mode];
    }

}
