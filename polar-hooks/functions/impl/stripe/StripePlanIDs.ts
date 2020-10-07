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
    FREE = "price_1HZQdbJvJ2rsXwXz3bOYr735",
    PLUS = "price_1HZ3lvJvJ2rsXwXzdK2V5XnM",
    PRO = "price_1HZ3mBJvJ2rsXwXzR4AN6Ub8",
}

export enum StripeYearPlanV2ID {
    FREE = "price_1HZQdbJvJ2rsXwXz3bOYr735",
    PLUS = "price_1HZ3mfJvJ2rsXwXzBh0uKg3y",
    PRO = "price_1HZ3n9JvJ2rsXwXzg8iEHuLg",
}

export enum Stripe4YearPlanV2ID {
    FREE = "price_1HZQdbJvJ2rsXwXz3bOYr735",
    PLUS = "price_1HZ3nPJvJ2rsXwXzN3IlrHtn",
    PRO = "price_1HZ3ncJvJ2rsXwXzIMze3OBe",
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

    public static fromSubscription(plan: Billing.Plan,
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
