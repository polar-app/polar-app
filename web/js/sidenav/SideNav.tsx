import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {useSideNavStore, TabDescriptor} from './SideNavStore';
import Divider from '@material-ui/core/Divider';
import {PolarSVGIcon} from "../ui/svg_icons/PolarSVGIcon";
import {SideNavButtonWithThumbnail} from "./SideNavButtonWithThumbnail";

const WIDTH = 50;

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: `${WIDTH}px`,
            backgroundColor: theme.palette.background.default
        },
        logo: {
            display: 'flex',
            "& *": {
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        divider: {
            marginBottom: '5px',
        }
    }),
);

export const SideNav = React.memo(() => {

    const classes = useStyles();

    const {tabs} = useSideNavStore(['tabs']);

    const toNavButton = React.useCallback((tab: TabDescriptor) => {
        return (
            <SideNavButtonWithThumbnail tab={tab}/>
        )
    }, []);

    return (
        <div className={classes.root}>

            <div className={classes.logo}>
                <PolarSVGIcon width={WIDTH} height={WIDTH}/>
            </div>

            <div className={classes.divider}>
                <Divider/>
            </div>

            {tabs.map(toNavButton)}
        </div>
    );

});