import { BottomNavigationAction } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import {useHistory, useLocation} from 'react-router-dom';
import { RoutePathnames } from '../apps/repository/RoutePathnames';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& .Mui-selected':{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
            },
        },
    })
);

interface IBottomNavLocation {
    readonly id: string;
    readonly label: string;
    readonly href: string;
    readonly icon: React.ReactNode;
}

const BOTTOM_NAV_LOCATIONS: ReadonlyArray<IBottomNavLocation> = [
    {
        id: 'home',
        label: 'Home',
        href: '/',
        icon: <HomeIcon/>
    },
    {
        id: 'add',
        label: 'Add',
        href: RoutePathnames.ADD_MOBILE,
        icon: <AddIcon/>
    },
    {
        id: 'settings',
        label: 'Settings',
        href: RoutePathnames.SETTINGS_MOBILE,
        icon: <SettingsIcon/>
    },
]

export const MUIBottomNavigation = ()  => {

    const theme = useTheme();
    const classes = useStyles();
    const history = useHistory();
    const [value, setValue] = React.useState('/');

    const location = useLocation();

    const changeRoute = React.useCallback((newValue: string) =>{

        if(newValue !== value){
            history.push(newValue);
        }

    }, [history, value]);

    React.useEffect(() => {
        setValue(location.pathname);
    }, [location])


    if (location.pathname.startsWith('/doc/')) {
        // hack to disable when opening up docs.
        return null;
    }

    return (
        <Paper style={{
                   // position: 'fixed',
                   // bottom: 0,
                   // left: 0,
                   // right: 0,
                   // zIndex:3
               }}
               elevation={3}>

            <BottomNavigation value={value}
                              onChange={(event, newValue) => changeRoute(newValue)}
                              showLabels
                              className={classes.root}>

                {BOTTOM_NAV_LOCATIONS.map(current => (
                    <BottomNavigationAction key={current.id}
                                            label={current.label}
                                            value={current.href}
                                            icon={current.icon}
                                            style={{
                                                backgroundColor: value === current.href ? theme.palette.primary.main : theme.palette.background.paper
                                            }}
                    />
                ))}

            </BottomNavigation>
        </Paper>
    );
}
