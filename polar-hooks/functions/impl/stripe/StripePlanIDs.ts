import {Billing} from 'polar-accounts/src/Billing';
import {Plans} from "polar-accounts/src/Plans";
import {IDStr} from "polar-shared/src/util/Strings";

/**
 * @Deprecated
 */
export enum StripePlanID {
    FREE = "plan_free",
    GOLD = "plan_gold",
    SILVER = "plan_silver",
    BRONZE = "plan_bronze"
}

/**
 * @Deprecated
 */
export enum StripeYearPlanID {
    FREE = "plan_free_year",
    GOLD = "plan_gold_year",
    SILVER = "plan_silver_year",
    BRONZE = "plan_bronze_year"
}

interface PlanIdentifiers {
    readonly FREE: IDStr;
    readonly PLUS: IDStr;
    readonly PRO: IDStr;
}

interface PlanIntervalIdentifiers {
    readonly _MONTH: PlanIdentifiers;
    readonly _YEAR: PlanIdentifiers;
    readonly _4YEAR: PlanIdentifiers;
}

const LIVE: PlanIntervalIdentifiers = {
    _MONTH: {
        FREE: "price_1Ha2GwJvJ2rsXwXzNDIxQ70K",
        PLUS: "price_1Ha27jJvJ2rsXwXzY5Yq42aD",
        PRO: "price_1Ha28iJvJ2rsXwXzlPCQiD0h",
    },
    _YEAR: {
        FREE: "price_1Ha2GwJvJ2rsXwXzNDIxQ70K",
        PLUS: "price_1Ha29PJvJ2rsXwXzEeM0YrOm",
        PRO: "price_1Ha2F8JvJ2rsXwXzt9zPYMCe",
    },
    _4YEAR: {
        FREE: "price_1Ha2GwJvJ2rsXwXzNDIxQ70K",
        PLUS: "price_1Ha2G0JvJ2rsXwXzNe7aumpf",
        PRO: "price_1Ha2GbJvJ2rsXwXzVp5bHmnC",
    }
}

export class StripePlanIDs {

    public static toSubscription(planID: StripePlanID | StripeYearPlanID): Billing.Subscription {

        switch (planID) {
            case StripePlanID.GOLD:
                return {interval: 'month', plan: 'gold'};
            case StripePlanID.SILVER:
                return {interval: 'month', plan: 'silver'};
            case StripePlanID.BRONZE:
                return {interval: 'month', plan: 'bronze'};
        }

        switch (planID) {
            case StripeYearPlanID.GOLD:
                return {interval: 'year', plan: 'gold'};
            case StripeYearPlanID.SILVER:
                return {interval: 'year', plan: 'silver'};
            case StripeYearPlanID.BRONZE:
                return {interval: 'year', plan: 'bronze'};
        }

        throw new Error("Invalid product: " + planID);

    }

    public static fromSubscription(plan: Billing.Plan | Billing.V2PlanLevel,
                                   interval: Billing.Interval): IDStr {

        if (!plan) {
            throw new Error("No plan");
        }

        const planV2 = Plans.toV2(plan);

        const identifiers = LIVE;

        const convertMonth = (): IDStr => {

            switch (planV2.level) {
                case "free":
                    return identifiers._MONTH.FREE;
                case "plus":
                    return identifiers._MONTH.PLUS;
                case "pro":
                    return identifiers._MONTH.PRO;
            }

        };

        const convertYear = (): IDStr => {

            switch (planV2.level) {
                case "free":
                    return identifiers._YEAR.FREE;
                case "plus":
                    return identifiers._YEAR.PLUS;
                case "pro":
                    return identifiers._YEAR.PRO;
            }

        };

        const convert4Year = (): IDStr => {

            switch (planV2.level) {
                case "free":
                    return identifiers._4YEAR.FREE;
                case "plus":
                    return identifiers._4YEAR.PLUS;
                case "pro":
                    return identifiers._4YEAR.PRO;
            }

        };

        switch (interval) {

            case "month":
                return convertMonth();

            case "year":
                return convertYear();

            case "4year":
                return convert4Year();

        }

    }

}
