import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { useSideNavStore, TabDescriptor } from './SideNavStore';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100px;',
            backgroundColor: theme.palette.background.default
        },
        button: {
            // borderRadius: '5px',
            width: '92px',
            borderLeftWidth: '4px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'transparent',
            marginBottom: '5px',
            paddingLeft: '3px',

            "& img": {
                width: '92px',
                borderRadius: '5px',
            },
            '&:hover': {
                borderLeftColor: theme.palette.primary.light
            },

        },
        activeButton: {
            borderLeftColor: theme.palette.primary.light
        },

    }),
);

    export const SideNav = React.memo(() => {

    const classes = useStyles();

    const {tabs, activeTab} = useSideNavStore(['tabs', 'activeTab']);

    const toNavButton = React.useCallback((tab: TabDescriptor) => {

        const active = tab.id === activeTab;

        console.log("FIXME: active: ", active);
        console.log("FIXME: activeTab: ", activeTab);

        const Title = () => {
            return (
                <b>
                    {tab.title}
                </b>
            );
        }

        return (
            <Tooltip placement="right"
                     enterDelay={0}
                     leaveDelay={0}
                     title={<Title/>}>

                <div key={`${tab.id}`}
                     className={clsx(classes.button, active && classes.activeButton)}>
                    {tab.icon}
                </div>
            </Tooltip>
        );

    }, [activeTab, classes.activeButton, classes.button]);

    return (
        <div className={classes.root}>
            {tabs.map(toNavButton)}
        </div>
    );

});