import { accounts } from "polar-accounts/src/accounts";

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

export class StripePlanIDs {

    public static toAccountPlan(planID: StripePlanID | StripeYearPlanID): accounts.Subscription {

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

    public static fromAccountPlan(plan: accounts.Plan,
                                  interval: accounts.Interval): StripePlanID | StripeYearPlanID {

        if (!plan) {
            throw new Error("No plan");
        }

        const convertMonthly = () => {

            switch (plan) {
                case "free":
                    return StripePlanID.FREE;
                case "bronze":
                    return StripePlanID.BRONZE;
                case "silver":
                    return StripePlanID.SILVER;
                case "gold":
                    return StripePlanID.GOLD;
            }

        };

        const convertYearly = () => {

            switch (plan) {
                case "free":
                    return StripeYearPlanID.FREE;
                case "bronze":
                    return StripeYearPlanID.BRONZE;
                case "silver":
                    return StripeYearPlanID.SILVER;
                case "gold":
                    return StripeYearPlanID.GOLD;
            }

        };

        switch (interval) {

            case "month":
                return convertMonthly();

            case "year":
                return convertYearly();

        }

    }

}
