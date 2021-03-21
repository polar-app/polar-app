import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export const SaveToPolarDemo = () => {

    const classes = useStyles();
    return (

        <div style={{display: 'flex', flexDirection: 'column'}}>

            <AppBar position="static"
                    color="inherit">
                <Toolbar>
                    {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">*/}
                    {/*    <MenuIcon />*/}
                    {/*</IconButton>*/}
                    <Typography variant="h6" className={classes.title}>
                        Polar
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>


            </AppBar>

            <LinearProgress/>

            <div style={{display: 'flex'}}>

                <div style={{
                         margin: 'auto',
                         maxWidth: '850px',
                         flexGrow: 1
                     }}>

                    <p>This is the main content.
                    </p>
                </div>

            </div>

        </div>
    )
}
