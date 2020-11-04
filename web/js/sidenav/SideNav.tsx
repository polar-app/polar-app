import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { useSideNavStore, TabDescriptor } from './SideNavStore';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100px;',
            backgroundColor: theme.palette.background.default
        },
        button: {
            borderRadius: '5px'
        }

    }),
);
export const SideNav = React.memo(() => {

    const classes = useStyles();

    const {tabs} = useSideNavStore(['tabs']);

    const toNavButton = React.useCallback((tab: TabDescriptor) => {

        return (
            <div key={`${tab.id}`}>

            </div>
        );

    }, []);

    return (
        <div className={classes.root}>
            {tabs.map(toNavButton)}
        </div>
    );

});