import {createStyles, makeStyles, Paper, Typography} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {Devices} from "polar-shared/src/util/Devices";
import React from "react";
import {useHistory, useLocation} from "react-router";
import {PlanPricingInterval} from "./PlansData";

const orientation = Devices.isPhone() ? 'vertical' : 'horizontal';

export const usePricingIntervalFromHash = () => {
    useLocation(); // This is only here to force rerenders

    switch (window.location.hash) {
        case `#${PlanPricingInterval.Monthly}`:
            return PlanPricingInterval.Monthly;
        case `#${PlanPricingInterval.Yearly}`:
            return PlanPricingInterval.Yearly;
        default:
            return PlanPricingInterval.Monthly;
    }
};

const useStyles = makeStyles(() =>
    createStyles({
        button: {
            width: "20em",
        },
    })
);

export const PlansIntervalToggle = React.memo(function PlansIntervalToggle() {
    const classes = useStyles();
    const history = useHistory();
    const pricingInterval = usePricingIntervalFromHash();

    const handleChange = React.useCallback((key: string) =>
        () => history.push(`${window.location.pathname}#${key}`), [history]);

    return (
        <Paper elevation={1}>
            <ToggleButtonGroup exclusive
                               orientation={orientation}
                               value={pricingInterval}>

                <ToggleButton className={classes.button}
                              value={PlanPricingInterval.Monthly}
                              onClick={handleChange(PlanPricingInterval.Monthly)}
                              aria-label="bold">
                    Monthly
                </ToggleButton>

                <ToggleButton className={classes.button}
                              value={PlanPricingInterval.Yearly}
                              onClick={handleChange(PlanPricingInterval.Yearly)}
                              aria-label="bold">
                    <Typography>Yearly</Typography>
                    &nbsp;&nbsp;
                    <Typography color="secondary">One Month Free</Typography>
                </ToggleButton>
            </ToggleButtonGroup>
        </Paper>
    );
});
