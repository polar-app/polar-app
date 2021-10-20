import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import LinkOffIcon from '@material-ui/icons/LinkOff';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        title: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
        },
        icon: {
            fontSize: '250px'
        }
    }),
);

export const NoDocument = () => {

    const classes = useStyles();

    return (
        <div className={classes.root}>

            <LinkOffIcon className={classes.icon}/>

            <h1>
                Ouch.  No document found for this ID.
            </h1>

        </div>
    );
}
