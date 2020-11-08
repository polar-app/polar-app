import {usePricingCallbacks, usePricingStore} from "./PricingStore";
import React from "react";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Billing} from "polar-accounts/src/Billing";
import Paper from "@material-ui/core/Paper/Paper";
import { Devices } from "polar-shared/src/util/Devices";
import { useLocation, useHistory } from "react-router-dom";

const useStyles = makeStyles({
  button: {
    width: "20em",
  },

});

export function useActivePlanIntervalFromLocation(): Billing.Interval {

    useLocation();

    // for some reason we're not getting the hash in the location change
    const hash = document.location.hash;

    if (hash === '#4year') {
        return '4year';
    }

    if (hash === '#month') {
        return 'month';
    }

    if (hash === '#year') {
        return 'year';
    }

    return 'month';

}

function useActivePlanIntervalRouter() {

    const interval = useActivePlanIntervalFromLocation();
    const {setInterval} = usePricingCallbacks();

    React.useEffect(() => {
        setInterval(interval);
    }, [interval, setInterval])

}

export function useActivePlanHandler() {

    const history = useHistory();

    return React.useCallback((interval: Billing.Interval) => {
        history.push({
            hash: `${interval}`
        });

    }, [history]);

}

export const PlanIntervalToggle = React.memo(() => {

    const classes = useStyles();
    useActivePlanIntervalRouter();

    const {interval} = usePricingStore(['interval']);
    const activePlanHandler = useActivePlanHandler();

    const orientation = Devices.isPhone() ? 'vertical' : 'horizontal';

    const handleChange = React.useCallback((event: React.MouseEvent, newInterval: Billing.Interval | null) => {
        activePlanHandler(newInterval || 'month');
    }, [activePlanHandler]);

    return (
        <Paper elevation={1}>

            <ToggleButtonGroup exclusive
                               orientation={orientation}
                               value={interval || 'month'}
                               onChange={handleChange}>

                <ToggleButton className={classes.button} value="month" aria-label="bold">
                    Monthly
                </ToggleButton>

                <ToggleButton className={classes.button} value="year" aria-label="bold">
                    <Typography>Yearly</Typography>
                    &nbsp;&nbsp;
                    <Typography color="secondary">One Month Free</Typography>
                </ToggleButton>

                <ToggleButton className={classes.button} value="4year" aria-label="bold">
                    <Typography>4 Years</Typography>
                    &nbsp;&nbsp;
                    <Typography color="secondary">Save Over 40%</Typography>
                </ToggleButton>

            </ToggleButtonGroup>
        </Paper>
    );

});

