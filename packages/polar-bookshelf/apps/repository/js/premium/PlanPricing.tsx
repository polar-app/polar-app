import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {usePricingStore} from "./PricingStore";
import {Discount} from "./Discounts";
import React from "react";
import {Billing} from "polar-accounts/src/Billing";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Numbers} from "polar-shared/src/util/Numbers";

const useStyles = makeStyles((theme) =>
    createStyles({
        price: {
            fontSize: '30px',
            margin: 0
        },
        regularPrice: {
            fontSize: '22px',
            margin: 0
        },
        interval: {
            fontSize: '15px',
            color: theme.palette.text.hint
        },
        billedAt: {
            fontSize: '1.3rem',
            lineHeight: '1.4rem',
            color: theme.palette.text.hint
        },

    }),
);

interface IProps {
    readonly plan: Billing.V2PlanLevel;
}

namespace PlanPrices {

    export function computeMonthPrice(plan: Billing.V2PlanLevel) {

        switch (plan) {
            case "free":
                return 0.0;
            case "plus":
                return 6.99;
            case "pro":
                return 14.99;
        }

    }

    export function computeYearPrice(plan: Billing.V2PlanLevel) {
        switch (plan) {
            case "free":
                return 0.0;
            case "plus":
                return 74.99;
            case "pro":
                return 164.99;
        }
    }

    export function compute4YearPrice(plan: Billing.V2PlanLevel) {
        switch (plan) {
            case "free":
                return 0.0;
            case "plus":
                return 199.99;
            case "pro":
                return 399.99;
        }
    }

}

export const PlanPricing = deepMemo(function PlanPricing(props: IProps) {

    const classes = useStyles();
    const {plan} = props;
    const {interval} = usePricingStore(['interval']);

    interface Pricing {
        readonly price: number;
        readonly discount: Discount | undefined;
        readonly priceNormalizedPerMonth: number;
        readonly regularPrice: number;
    }

    const computePrice = (): Pricing => {

        function computePriceFromInterval() {

            switch(interval) {
                case "month":
                    return PlanPrices.computeMonthPrice(plan);
                case "year":
                    return PlanPrices.computeYearPrice(plan);
                case "4year":
                    return PlanPrices.compute4YearPrice(plan);

            }

        }

        function intervalToMonths() {
            switch (interval) {
                case "month":
                    return 1;
                case "year":
                    return 12;
                case "4year":
                    return 48;
            }
        }

        const price = computePriceFromInterval();

        const priceNormalizedPerMonth = Numbers.toFixedFloat(price / intervalToMonths(), 2);
        const regularPrice = PlanPrices.computeMonthPrice(plan);

        return {price, discount: undefined, priceNormalizedPerMonth, regularPrice};

    }

    const pricing = computePrice();

    if (pricing.discount !== undefined) {

        return <div>

            <s>
                <h3 className="">${pricing.discount.before}<span
                    className="">/{interval}</span>
                </h3>
            </s>

            <h3 className="">
                ${pricing.discount.after}<span
                className="">/{interval}</span>
            </h3>

        </div>;

    } else {

        return (
            <>
                <h3 className={classes.price}>${pricing.priceNormalizedPerMonth}
                    <span className={classes.interval}>/month</span>
                </h3>

                {(interval !== 'month' && plan !== 'free') && (
                    <>

                        <s>
                            <h3 className={classes.regularPrice}>${pricing.regularPrice}
                                <span className={classes.interval}>/month</span>
                            </h3>
                        </s>

                        {interval === 'year' && (
                            <p className={classes.billedAt}>
                                Billed yearly at ${pricing.price}
                                {/*<br/> with a 14 day trial.*/}
                            </p>
                        )}

                        {interval === '4year' && (
                            <p className={classes.billedAt}>
                                Billed once at ${pricing.price}
                                {/*<br/> with a 14 day trial.*/}
                            </p>
                        )}

                    </>
                )}
            </>
        );

    }

});

