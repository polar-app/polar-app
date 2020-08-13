import {PlanInterval} from "./PremiumContent2";
import {accounts} from "polar-accounts/src/accounts";

export interface Discount {
    readonly interval: accounts.Interval;
    readonly plan: accounts.Plan;
    readonly before: number;
    readonly after: number;
}

const XMAS_2019: ReadonlyArray<Discount> = [
    {
        interval: 'year',
        plan: 'bronze',
        before: 4.99 * 12,
        after: 19.95
    },
    {
        interval: 'year',
        plan: 'silver',
        before: 9.99 * 12,
        after: 24.95
    },
    {
        interval: 'year',
        plan: 'gold',
        before: 14.99 * 12,
        after: 29.95
    }

];

const DISCOUNTS: ReadonlyArray<Discount> = [];

export interface DiscountMap {
    [key: string]: Discount;
}

export class Discounts {

    constructor(private delegate: DiscountMap = {}) {

    }

    public get(interval: PlanInterval, plan: accounts.Plan): Discount | undefined {
        const key = Discounts.key(interval, plan);
        return this.delegate[key] || undefined;
    }

    private static key(interval: PlanInterval, plan: accounts.Plan) {
        return `${interval}:${plan}`;
    }

    public static create() {

        const backing: DiscountMap = {};

        for (const discount of DISCOUNTS) {
            const key = this.key(discount.interval, discount.plan);
            backing[key] = discount;
        }

        return new Discounts(backing);

    }

}
