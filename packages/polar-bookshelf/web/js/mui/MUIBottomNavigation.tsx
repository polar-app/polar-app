import { BottomNavigationAction } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import * as React from 'react';

import { createStyles, makeStyles } from "@material-ui/core/styles";

import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from 'react-router-dom';

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

    return (
        <BottomNavigation value={value}
                          onChange={(event, newValue) => {
                            setValue(newValue);
                            history.replace(newValue);
                          }}                          
                          showLabels
                          className={classes.root}>
            <BottomNavigationAction label="Home" value='/' icon={<HomeIcon/>} />
            {/* <BottomNavigationAction label="Search" value='#search' icon={<SearchIcon />} /> */}
            <BottomNavigationAction label="Add" value='#add' icon={<AddIcon />} />
            {/* <BottomNavigationAction label="Switch" value='#switch' icon={<ViewCarouselIcon />} /> */}
        </BottomNavigation>
    );
}
