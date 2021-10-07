import * as React from 'react';
import {createStyles, makeStyles, useTheme} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) =>
    createStyles({
        root:{
            display: 'flex',
            height: '3em',
            alignItems: 'center',
            padding: '0 0.1em',
            backgroundColor: theme.palette.background.paper
        },
        title:{
            fontSize: '1em',
            paddingLeft: '1em'
        }
    })
);

export const PreferencesBar = React.memo(function PreferencesBar() {
    
    const classes = useStyles();
    const history = useHistory();

    return(
        <>
            <div className={classes.root}>
                <IconButton onClick={()=>history.goBack()}>
                    <ArrowBackIcon/>
                </IconButton>
                <span className={classes.title}>Preferences</span>   
            </div>
        </>
    );
});
