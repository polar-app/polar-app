import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {useSideNavStore, TabDescriptor} from './SideNavStore';
import Divider from '@material-ui/core/Divider';
import {PolarSVGIcon} from "../ui/svg_icons/PolarSVGIcon";
import {SideNavButtonWithIcon} from "./SideNavButtonWithIcon";
import {FAHomeIcon} from "../mui/MUIFontAwesome";
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';

const WIDTH = 72;

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
            padding: theme.spacing(1)
        },
        buttons: {
            flexGrow: 1,
            minHeight: 0,
            overflow: 'hidden'
        }
    }),
);

const HomeButton = () => {

    const history = useHistory();

    return (
        <IconButton onClick={() => history.push('/')}>
            <FAHomeIcon/>
        </IconButton>
    )
}

export const SideNav = React.memo(() => {

    const classes = useStyles();

    const {tabs} = useSideNavStore(['tabs']);

    const toNavButton = React.useCallback((tab: TabDescriptor) => {
        return (
            <SideNavButtonWithIcon key={tab.id} tab={tab}/>
        )
    }, []);

    return (
        <div className={classes.root}>

            <div className={classes.logo}>
                <PolarSVGIcon width={WIDTH - 4} height={WIDTH - 4}/>
            </div>

            <div className={classes.divider}>
                <Divider/>
            </div>

            <HomeButton/>

            <div className={classes.divider}>
                <Divider/>
            </div>

            <div className={classes.buttons}>
                {tabs.map(toNavButton)}
            </div>

        </div>
    );

});