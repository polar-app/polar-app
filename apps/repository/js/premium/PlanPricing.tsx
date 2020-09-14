import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {usePremiumStore} from "./PremiumStore";
import {Discount} from "./Discounts";
import React from "react";
import {Billing} from "polar-accounts/src/Billing";
import { Numbers } from "polar-shared/src/util/Numbers";

interface IProps {
    readonly plan: Billing.V2PlanLevel;
}

export const PlanPricing = deepMemo((props: IProps) => {

    const {interval} = usePremiumStore(['interval']);

    const computeMonthlyPrice = () => {

        switch (props.plan) {

            case "free":
                return 0.0;
            case "plus":
                return 6.99;
            case "pro":
                return 14.99;
        }

    };

    const computeYearlyPrice = () => {
        const monthlyAmount = computeMonthlyPrice();
        return Numbers.toFixedFloat(monthlyAmount * 11, 2);
    };

    interface Pricing {
        readonly price: number;
        readonly discount: Discount | undefined;
    }

    const computePrice = (): Pricing => {

        const price = interval === 'month' ? computeMonthlyPrice() : computeYearlyPrice();
        // const discount = discounts.get(interval, props.plan);

        return {price, discount: undefined};
    };

    const pricing = computePrice();

    if (pricing.discount) {

        return <div>

            <s>
                <h3 className="text-xxlarge">${pricing.discount.before}<span
                    className="text-small">/{interval}</span>
                </h3>
            </s>

            <h3 className="text-xxlarge">
                ${pricing.discount.after}<span
                className="text-small">/{interval}</span>
            </h3>

        </div>;

    } else {

        return <div>
            <h3 className="text-xxlarge">${pricing.price}<span
                className="text-small">/{interval}</span>
            </h3>

        </div>;

    }

});

