import {AccountPlan, PlanInterval} from "./StripeWebhookFunction";

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

    public static toAccountPlan(planID: StripePlanID | StripeYearPlanID): AccountPlan {

        switch (planID) {
            case StripePlanID.GOLD:
                return 'gold';
            case StripePlanID.SILVER:
                return 'silver';
            case StripePlanID.BRONZE:
                return 'bronze';
        }

        switch (planID) {
            case StripeYearPlanID.GOLD:
                return 'gold';
            case StripeYearPlanID.SILVER:
                return 'silver';
            case StripeYearPlanID.BRONZE:
                return 'bronze';
        }

        throw new Error("Invalid product: " + planID);

    }

    public static fromAccountPlan(plan: AccountPlan,
                                  interval: PlanInterval): StripePlanID | StripeYearPlanID {

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
