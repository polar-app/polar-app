import React from 'react';
import {NotesRepoTable2} from './NotesRepoTable2';
import {MUICalendarMonthDayIcon} from "../../../../web/js/mui/MUICalendarMonthDayIcon";
import {DeviceRouters} from '../../../../web/js/ui/DeviceRouter';
import Fab from '@material-ui/core/Fab';
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {useHistory} from 'react-router-dom';

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


export const NotesRepoScreen2 = React.memo(function NotesRepoScreen2() {


    return (
        <>
            <NotesRepoTable2/>

            <DeviceRouters.NotDesktop>
                <MobileDailyNotesFab/>
            </DeviceRouters.NotDesktop>
        </>
    )
})

const MobileDailyNotesFab = () => {

    const classes = useStyles();
    const history = useHistory();

    return (
        <Fab color="primary"
             aria-label="add"
             onClick={() => history.push("/daily")}
             className={classes.fab}>
            <MUICalendarMonthDayIcon className={classes.icon}/>
        </Fab>
    );
}
