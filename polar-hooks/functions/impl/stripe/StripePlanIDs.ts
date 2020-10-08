import {Billing} from 'polar-accounts/src/Billing';
import {Plans} from "polar-accounts/src/Plans";

export enum StripePlanID {
    FREE = "plan_free",
    GOLD = "plan_gold",
    SILVER = "plan_silver",
    BRONZE = "plan_bronze"
}

export enum StripeYearPlanID {
    FREE = "plan_free_year",
    GOLD = "plan_gold_year",
    SILVER = "plan_silver_year",
    BRONZE = "plan_bronze_year"
}

export enum StripePlanV2ID {
    FREE = "price_1Ha2GwJvJ2rsXwXzNDIxQ70K",
    PLUS = "price_1Ha27jJvJ2rsXwXzY5Yq42aD",
    PRO = "price_1Ha28iJvJ2rsXwXzlPCQiD0h",
}

export enum StripeYearPlanV2ID {
    FREE = "price_1Ha2GwJvJ2rsXwXzNDIxQ70K",
    PLUS = "price_1Ha29PJvJ2rsXwXzEeM0YrOm",
    PRO = "price_1Ha2F8JvJ2rsXwXzt9zPYMCe",
}

export enum Stripe4YearPlanV2ID {
    FREE = "price_1Ha2GwJvJ2rsXwXzNDIxQ70K",
    PLUS = "price_1Ha2G0JvJ2rsXwXzNe7aumpf",
    PRO = "price_1Ha2GbJvJ2rsXwXzVp5bHmnC",
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
                                   interval: Billing.Interval): StripePlanV2ID | StripeYearPlanV2ID | Stripe4YearPlanV2ID {

        if (!plan) {
            throw new Error("No plan");
        }

        const planV2 = Plans.toV2(plan);

        const convertMonth = (): StripePlanV2ID => {

            switch (planV2.level) {
                case "free":
                    return StripePlanV2ID.FREE;
                case "plus":
                    return StripePlanV2ID.PLUS;
                case "pro":
                    return StripePlanV2ID.PRO;
            }

        };

        const convertYear = (): StripeYearPlanV2ID => {

            switch (planV2.level) {
                case "free":
                    return StripeYearPlanV2ID.FREE;
                case "plus":
                    return StripeYearPlanV2ID.PLUS;
                case "pro":
                    return StripeYearPlanV2ID.PRO;
            }

        };

        const convert4Year = (): Stripe4YearPlanV2ID => {

            switch (planV2.level) {
                case "free":
                    return Stripe4YearPlanV2ID.FREE;
                case "plus":
                    return Stripe4YearPlanV2ID.PLUS;
                case "pro":
                    return Stripe4YearPlanV2ID.PRO;
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
