import {AccountPlan} from "./StripeWebhookFunction";

export enum StripePlanID {

    GOLD = "plan_gold",
    SILVER = "plan_silver",
    BRONZE = "plan_bronze"

}

export enum StripeYearPlanID {

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

    public static fromAccountPlan(plan: AccountPlan): StripePlanID {

        if (!plan) {
            throw new Error("No plan");
        }

        if (plan.startsWith("bronze")) {
            return StripePlanID.BRONZE;
        }

        if (plan.startsWith("silver")) {
            return StripePlanID.SILVER;
        }

        if (plan.startsWith("gold")) {
            return StripePlanID.GOLD;
        }

        throw new Error("Invalid plan: " + plan);

    }

}
