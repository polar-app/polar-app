import { BottomNavigationAction } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Paper from '@material-ui/core/Paper';
import * as React from 'react';

import { createStyles, makeStyles } from "@material-ui/core/styles";

import AddIcon from '@material-ui/icons/Add';
// import SearchIcon from '@material-ui/icons/Search';
// import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from 'react-router-dom';
import { RoutePathnames } from '../apps/repository/RoutePathnames';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& .Mui-selected':{
                backgroundColor: '#6754D6',
                color: 'white'
            },
        },
    })
);
export const MUIBottomNavigation = ()  => {
    const classes = useStyles();
    const history = useHistory();
    const [value, setValue] = React.useState('/');

    const changeRoute = (newValue: string) =>{
        if(newValue !== value){
            setValue(newValue);
            history.push(newValue);
        }
    }

    return (
        <Paper style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex:3 }} elevation={3}>
            <BottomNavigation value={value}
                            onChange={(event, newValue) => changeRoute(newValue)}                          
                            showLabels
                            className={classes.root}>
                <BottomNavigationAction label="Home" value='/' icon={<HomeIcon/>} />
                {/* <BottomNavigationAction label="Search" value='#search' icon={<SearchIcon />} /> */}
                <BottomNavigationAction label="Add" value={RoutePathnames.ADD_MOBILE} icon={<AddIcon />} />
                {/* <BottomNavigationAction label="Switch" value='#switch' icon={<ViewCarouselIcon />} /> */}
            </BottomNavigation>
        </Paper>
    );
}
