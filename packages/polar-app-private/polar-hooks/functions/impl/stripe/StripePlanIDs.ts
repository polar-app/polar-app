import {Billing} from 'polar-accounts/src/Billing';
import {Plans} from "polar-accounts/src/Plans";
import {IDStr} from "polar-shared/src/util/Strings";
import {StripeMode} from "./StripeUtils";
import V2PlanFree = Billing.V2PlanFree;
import V2PlanPlus = Billing.V2PlanPlus;
import V2PlanPro = Billing.V2PlanPro;

export type StripePriceID = string;

interface PlanIdentifiers {
    readonly FREE: StripePriceID;
    readonly PLUS: StripePriceID;
    readonly PRO: StripePriceID;
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

const TEST: PlanIntervalIdentifiers = {
    _MONTH: {
        FREE: "price_1Ha2KjJvJ2rsXwXzuzeKA4R6",
        PLUS: "price_1HPVRyJvJ2rsXwXz3ThL6Mq6",
        PRO: "price_1HPVTxJvJ2rsXwXzFssQ4DU0",
    },
    _YEAR: {
        FREE: "price_1Ha2KjJvJ2rsXwXzuzeKA4R6",
        PLUS: "price_1HPVXPJvJ2rsXwXzzB9YFe0f",
        PRO: "price_1HPVYkJvJ2rsXwXzLXXwxrs9",
    },
    _4YEAR: {
        FREE: "price_1Ha2KjJvJ2rsXwXzuzeKA4R6",
        PLUS: "price_1HPVc1JvJ2rsXwXzlWOo1oHc",
        PRO: "price_1Ha2KUJvJ2rsXwXzXDWzFhUx",
    }
}


export class StripePlanIDs {

    public static toSubscription(mode: StripeMode, priceID: StripePriceID): Billing.V2Subscription {

        const identifiers = mode === 'live' ? LIVE : TEST;

        switch (priceID) {

            // *** month
            
            case identifiers._MONTH.FREE: 
                return {plan: V2PlanFree, interval: 'month'};
            case identifiers._MONTH.PLUS:
                return {plan: V2PlanPlus, interval: 'month'};
            case identifiers._MONTH.PRO:
                return {plan: V2PlanPro, interval: 'month'};

            // *** year

            case identifiers._YEAR.FREE:
                return {plan: V2PlanFree, interval: 'year'};
            case identifiers._YEAR.PLUS:
                return {plan: V2PlanPlus, interval: 'year'};
            case identifiers._YEAR.PRO:
                return {plan: V2PlanPro, interval: 'year'};

            // *** 4year

            case identifiers._4YEAR.FREE:
                return {plan: V2PlanFree, interval: '4year'};
            case identifiers._4YEAR.PLUS:
                return {plan: V2PlanPlus, interval: '4year'};
            case identifiers._4YEAR.PRO:
                return {plan: V2PlanPro, interval: '4year'};

            case 'plan_bronze':
                return {plan: V2PlanPlus, interval: 'month'};
            case 'plan_silver':
                return {plan: V2PlanPlus, interval: 'month'};
            case 'plan_gold':
                return {plan: V2PlanPro, interval: 'month'};

            case 'plan_bronze_year':
                return {plan: V2PlanPlus, interval: 'year'};
            case 'plan_silver_year':
                return {plan: V2PlanPlus, interval: 'year'};
            case 'plan_gold_year':
                return {plan: V2PlanPro, interval: 'year'};


        }

        throw new Error(`Invalid product: ${priceID} for mode ${mode}`);

    }

    public static fromSubscription(mode: StripeMode,
                                   plan: Billing.Plan | Billing.V2PlanLevel,
                                   interval: Billing.Interval): IDStr {

        if (!plan) {
            throw new Error("No plan");
        }

        const planV2 = Plans.toV2(plan);

        const identifiers = mode === 'live' ? LIVE : TEST;

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
