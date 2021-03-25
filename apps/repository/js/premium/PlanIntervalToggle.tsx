import {usePricingCallbacks, usePricingStore} from "./PricingStore";
import React from "react";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Billing} from "polar-accounts/src/Billing";
import Paper from "@material-ui/core/Paper/Paper";
import { Devices } from "polar-shared/src/util/Devices";
import { useHistory } from "react-router-dom";
import {useComponentDidMount, useComponentWillUnmount} from "../../../../web/js/hooks/ReactLifecycleHooks";
import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {useRefValue} from "../../../../web/js/hooks/ReactHooks";
import {ILocation} from "../../../../web/js/react/router/ReactRouters";

const useStyles = makeStyles({
  button: {
    width: "20em",
  },

});

function useLocationListener() {

    const [location, setLocation] = React.useState<ILocation | undefined>();
    const unsubscriberRef = React.useRef<SnapshotUnsubscriber>();
    const history = useHistory();
    const historyRef = useRefValue(history);

    useComponentDidMount(() => {

        if (historyRef.current) {
            unsubscriberRef.current = historyRef.current.listen(location => setLocation(location));
        } else {
            console.warn("No history");
        }

    });

    useComponentWillUnmount(() => {
        if (unsubscriberRef.current) {
            unsubscriberRef.current();
        }
    });

    return location;

}

export function useActivePlanIntervalFromLocation(): Billing.Interval {

    const location = useLocationListener();

    // for some reason we're not getting the hash in the location change
    const hash = location?.hash;

    if (hash === '#4year') {
        return '4year';
    }

    if (hash === '#year') {
        return 'year';
    }

    if (hash === '#month') {
        return 'month';
    }

    return 'month';

}

function useActivePlanIntervalRouter() {

    const {interval} = usePricingStore(['interval']);
    const {setInterval} = usePricingCallbacks();

    React.useEffect(() => {
        setInterval(interval);
    }, [interval, setInterval])

}

export function useActivePlanHandler() {

    const {setInterval} = usePricingCallbacks();

    return React.useCallback((interval: Billing.Interval) => {
        setInterval(interval)
    }, [setInterval]);

}

export const PlanIntervalToggle = React.memo(function PlanIntervalToggle() {

    const classes = useStyles();

    const {interval} = usePricingStore(['interval']);
    const activePlanHandler = useActivePlanHandler();

    const orientation = Devices.isPhone() ? 'vertical' : 'horizontal';

    const handleChange = React.useCallback((newInterval: Billing.Interval | null) => {
        activePlanHandler(newInterval || 'month');
    }, [activePlanHandler]);

    return (
        <Paper elevation={1}>

            <ToggleButtonGroup exclusive
                               orientation={orientation}
                               value={interval || 'month'}>

                <ToggleButton className={classes.button}
                              value="month"
                              onClick={() => handleChange('month')}
                              aria-label="bold">
                    Monthly
                </ToggleButton>

                <ToggleButton className={classes.button}
                              value="year"
                              onClick={() => handleChange('year')}
                              aria-label="bold">
                    <Typography>Yearly</Typography>
                    &nbsp;&nbsp;
                    <Typography color="secondary">One Month Free</Typography>
                </ToggleButton>

                <ToggleButton className={classes.button}
                              value="4year"
                              onClick={() => handleChange('4year')}
                              aria-label="bold">
                    <Typography>4 Years</Typography>
                    &nbsp;&nbsp;
                    <Typography color="secondary">Save Over 40%</Typography>
                </ToggleButton>

            </ToggleButtonGroup>
        </Paper>
    );

});

