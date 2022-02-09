import {useHistory} from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import {MUICalendarMonthDayIcon} from "../../../../web/js/icons/MUICalendarMonthDayIcon";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        fab: {
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            position: 'absolute',
            display: 'flex'
        },
        icon: {
            display: 'flex'
        }
    })
);

export const MobileDailyNotesFab = () => {

    const classes = useStyles();
    const history = useHistory();

    return (
        <Fab color="secondary"
             aria-label="add"
             onClick={() => history.push("/daily")}
             className={classes.fab}>

            <MUICalendarMonthDayIcon className={classes.icon}/>
        </Fab>
    );
}
