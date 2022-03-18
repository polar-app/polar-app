import React from "react";
import {Box, makeStyles, Paper} from "@material-ui/core";
import {PurchaseOrChangePlanButton} from "./PurchaseOrChangePlanButton";
import {Plan, PlanFeature, PlanPricingInterval, PLANS, PLAN_FEATURE_LABELS} from "../plans_table/PlansData";
import {PlansPricing} from "../plans_table/PlansPricing";
import {PlansTableFeatureValue} from "../plans_table/PlansTableFeatureValue";
import {PlansIntervalToggle, usePricingIntervalFromHash} from "../plans_table/PlansIntervalToggle";

const useStyles = makeStyles({
    checkCircle: {
        maxHeight: "24px",
    },

    row: {
        height: "55px",
    },

    pricing: {
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "32px",
        lineHeight: "37px",
        letterSpacing: "0.15px",
        color: "#E0E0E0",
        margin: "20px 0",
    },

    subtitleMobile: {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "16px",
        lineHeight: "19px",

        textAlign: "center",
        letterSpacing: "0.15px",
        marginTop: "5px",
        color: "#E0E0E0",
        paddingBottom: "8%",
    },

    rowHeadMobile: {
        textAlign: "left",
    },

    pricePlanMobile: {
        mixBlendMode: "normal",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "300px",
        margin: "5px",
    },

    tableMobile: {
        mixBlendMode: "normal",
        borderCollapse: "collapse",
        textAlign: "center",
        fontSize: "16px",
        width: '100%',
        marginLeft: '1rem',
        marginRight: '1rem',
    },
});

interface PlanBoxProps {
    readonly plan: Plan;
    readonly interval: PlanPricingInterval;
}

const PlanBox = (props: PlanBoxProps) => {
    const { interval, plan } = props;
    const classes = useStyles();

    return (
        <Paper elevation={1} style={{margin: '1rem'}}>

            <Box className={classes.pricePlanMobile} px={2} py={1}>
                <Box className={classes.pricing}>{plan.label}</Box>
                <Box className={classes.subtitleMobile} dangerouslySetInnerHTML={{ __html: plan.subtitle }} />

                <Box className={classes.pricing} display="flex" alignItems="center" flexDirection="column">
                    <PlansPricing pricingInterval={interval} pricingData={plan.price} />
                </Box>

                <PurchaseOrChangePlanButton newSubscription={{ plan: plan.type, interval: interval }} />

                <table className={classes.tableMobile}>
                    <tbody>
                        {Object.values(PlanFeature).map((featKey) => (
                            <tr key={featKey} className={classes.row}>
                                <td className={classes.rowHeadMobile}>
                                    {PLAN_FEATURE_LABELS[featKey]}
                                </td>
                                <td><PlansTableFeatureValue value={plan.features[featKey]} /></td>
                            </tr>
                        ))}
                    </tbody>
              </table>
            </Box>
        </Paper>
    );
}

export const PricingContentForMobile = React.memo(() => {

    const interval = usePricingIntervalFromHash();

    return (
        <Box display="flex"
             flexDirection="column"
             alignItems="center"
             width="100%">
            <Box my="1em">
                <PlansIntervalToggle />
            </Box>

            {Object.entries(PLANS).map(([key, plan]) => (
                <PlanBox plan={plan}
                         key={key}
                         interval={interval} />
            ))}
        </Box>
    );
});
