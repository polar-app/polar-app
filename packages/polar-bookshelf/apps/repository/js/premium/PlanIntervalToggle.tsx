import {usePremiumCallbacks, usePremiumStore} from "./PremiumStore";
import React from "react";
import {PlanInterval} from "./PremiumContent";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  button: {
    width: "22em",
  },

});

export const PlanIntervalToggle = React.memo(() => {

    const classes = useStyles();

    const {interval} = usePremiumStore(['interval']);
    const {setInterval} = usePremiumCallbacks();

    function handleChange(event: React.MouseEvent, newInterval: PlanInterval | null) {
        setInterval(newInterval || 'month');
    }

    return (
        <ToggleButtonGroup exclusive
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

            {/*<ToggleButton value="4year" aria-label="bold">*/}
            {/*  4 years <i>Save Over 40%!</i>*/}
            {/*</ToggleButton>*/}

        </ToggleButtonGroup>
    );

});

