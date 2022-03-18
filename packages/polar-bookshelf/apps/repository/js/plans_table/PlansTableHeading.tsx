import {Box} from "@material-ui/core";
import React from "react";
import {PurchaseOrChangePlanButton} from "../premium/PurchaseOrChangePlanButton";
import {PlanPricingInterval, PLANS} from "./PlansData";
import {usePricingIntervalFromHash} from "./PlansIntervalToggle";
import {PlansPricing} from "./PlansPricing";
import {usePlansTableStyles} from "./PlansTable";

interface IPlansTableHeadingProps {
    readonly pricingInterval: PlanPricingInterval;
    readonly currentPlanLabel?: string;
}


export const PlansTableHeading: React.FC<IPlansTableHeadingProps> = React.memo((props) => {
    const { pricingInterval, currentPlanLabel } = props;
    const classes = usePlansTableStyles();
    const interval = usePricingIntervalFromHash();

    return (
        <thead>
            <tr>
                <th />
                {Object.values(PLANS).map((plan) => (
                    <th key={plan.label} style={{ verticalAlign: 'top' }}>
                        <Box className={classes.header}>{plan.label}</Box>
                        <Box className={classes.pricing}>
                            <PlansPricing pricingInterval={pricingInterval} pricingData={plan.price} />
                        </Box>
                        <PurchaseOrChangePlanButton newSubscription={{ plan: plan.type, interval }}
                                                    currentPlanLabel={currentPlanLabel} />
                    </th>
                ))}
            </tr>
            <tr className={classes.row}>
                <th />
                {Object.values(PLANS).map(plan => <th key={plan.label}>{plan.label}</th>)}
            </tr>
        </thead>
    );
});
