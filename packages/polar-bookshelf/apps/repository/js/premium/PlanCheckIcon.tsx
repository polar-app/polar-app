import React from "react";
import {FACheckCircleIcon} from "../../../../web/js/icons/MUIFontAwesome";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.primary.light
        },
    }),
);


export const PlanCheckIcon = React.memo(function PlanCheckIcon() {

    const classes = useStyles();

    return (
        <FACheckCircleIcon className={classes.root} />
    );

});
