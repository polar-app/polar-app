import {createStyles, makeStyles} from "@material-ui/core";
import {Numbers} from "polar-shared/src/util/Numbers";
import React from "react";
import {PlanPricingInterval, PLAN_INTERVAL_MONTHS} from "./PlansData";

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

interface IPlansTableHeadingProps {
    readonly pricingInterval: PlanPricingInterval;
    readonly pricingData: Record<PlanPricingInterval, number>;
}

const computePrice = (interval: PlanPricingInterval, pricingData: Record<PlanPricingInterval, number>) => {
    const price         = pricingData[interval];
    const pricePerMonth = Numbers.toFixedFloat(price / PLAN_INTERVAL_MONTHS[interval], 2);
    const regularPrice  = pricingData[PlanPricingInterval.Monthly];

    return {
        price,
        pricePerMonth,
        regularPrice,
    };
};

export const PlansPricing: React.FC<IPlansTableHeadingProps> = (props) => {
    const classes = useStyles();
    const { pricingInterval, pricingData } = props;

    const { price, pricePerMonth, regularPrice } = React.useMemo(() =>
        computePrice(pricingInterval, pricingData), [pricingInterval, pricingData]);

    return (
        <>
            <h3 className={classes.price}>${pricePerMonth}
                <span className={classes.interval}>/month</span>
            </h3>

            {(pricingInterval !== PlanPricingInterval.Monthly) && (price !== regularPrice) && (
                <>
                    <s>
                        <h3 className={classes.regularPrice}>${regularPrice}
                            <span className={classes.interval}>/month</span>
                        </h3>
                    </s>

                    <p className={classes.billedAt}>
                        Billed yearly at ${price}
                    </p>
                </>
            )}
        </>
    );
};
