import {AccountPlan} from "../../../../../../web/js/accounts/Account";
import {PlanInterval} from "./PremiumContent2";

export interface Discount {
    readonly interval: PlanInterval;
    readonly plan: AccountPlan;
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

const DISCOUNTS = XMAS_2019;

export interface DiscountMap {
    [key: string]: Discount;
}

export class Discounts {

    constructor(private delegate: DiscountMap = {}) {

    }

    public get(interval: PlanInterval, plan: AccountPlan): Discount | undefined {
        const key = Discounts.key(interval, plan);
        return this.delegate[key] || undefined;
    }

    private static key(interval: PlanInterval, plan: AccountPlan) {
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
