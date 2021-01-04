import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {useSideNavStore, TabDescriptor} from './SideNavStore';
import Divider from '@material-ui/core/Divider';
import {PolarSVGIcon} from "../ui/svg_icons/PolarSVGIcon";
import {SideNavButtonWithIcon} from "./SideNavButtonWithIcon";
import {FAHomeIcon, FAStickyNoteIcon} from "../mui/MUIFontAwesome";
import {useHistory} from 'react-router-dom';
import TimelineIcon from '@material-ui/icons/Timeline';
import {ActiveTabButton} from "./ActiveTabButton";
import SettingsIcon from '@material-ui/icons/Settings';
import NoteIcon from '@material-ui/icons/Note';
import DescriptionIcon from '@material-ui/icons/Description';

export const SIDENAV_WIDTH = 56;
export const SIDENAV_BUTTON_SIZE = SIDENAV_WIDTH - 10;
export const SIDENAV_SECONDARY_BUTTON_SIZE = SIDENAV_WIDTH - 32;

// 80 and 48x48 figma icons
//
// export const SIDENAV_WIDTH = 80;
// export const SIDENAV_BUTTON_SIZE = 32;
// export const SIDENAV_SECONDARY_BUTTON_SIZE = 32;


const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: SIDENAV_WIDTH,
            minWidth: SIDENAV_WIDTH,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.background.default,
            alignItems: 'center'
        },
        logo: {
            display: 'flex',
            cursor: 'pointer',
            "& *": {
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        divider: {
            marginBottom: '5px',
            margin: theme.spacing(1),
            height: '1px'
        },
        buttons: {
            flexGrow: 1,
            minHeight: 0,
            overflow: 'hidden'
        },
        historyButton: {
            color: theme.palette.text.secondary,

            '&:hover': {
                color: theme.palette.text.primary
            },

        },
        secondaryIcon: {
            width: SIDENAV_SECONDARY_BUTTON_SIZE,
            height: SIDENAV_SECONDARY_BUTTON_SIZE
        }
    }),
);

interface HistoryButtonProps {
    readonly path: string;
    readonly title: string;
    readonly children: JSX.Element;
}

const HistoryButton = React.memo((props: HistoryButtonProps) => {

    const history = useHistory();

    return (
        <ActiveTabButton title={props.title}
                         path={props.path}
                         onClick={() => history.push(props.path)}>
            {props.children}
        </ActiveTabButton>
    )
});


const HomeButton = React.memo(() => {

    const history = useHistory();
    const classes = useStyles();

    return (
        <ActiveTabButton title="Documents"
                         path="/"
                         onClick={() => history.push('/')}>
            <DescriptionIcon className={classes.secondaryIcon}/>
        </ActiveTabButton>
    )
});

const AnnotationsButton = React.memo(() => {

    const classes = useStyles();

    return (
        <HistoryButton title="Annotations"
                       path="/annotations">
            <NoteIcon className={classes.secondaryIcon}/>
        </HistoryButton>
    )
});



const StatsButton = React.memo(() => {

    const classes = useStyles();

    return (
        <HistoryButton title="Statistics"
                       path="/stats">
            <TimelineIcon className={classes.secondaryIcon}/>
        </HistoryButton>
    )
});

const SettingsButton = React.memo(() => {

    const classes = useStyles();

    return (
        <HistoryButton title="Settings"
                       path="/settings">
            <SettingsIcon className={classes.secondaryIcon}/>
        </HistoryButton>
    )
});


const PolarButton = React.memo(() => {

    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={classes.logo} onClick={() => history.push('')}>
            <PolarSVGIcon width={SIDENAV_BUTTON_SIZE}
                          height={SIDENAV_BUTTON_SIZE}/>
        </div>
    );

})

const SideNavDivider = React.memo(() => {

    const classes = useStyles();

    return (
        <Divider orientation="horizontal" flexItem={true} className={classes.divider}/>
    )

});

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

            <PolarButton/>

            <SideNavDivider/>

            <HomeButton/>
            <AnnotationsButton/>
            <StatsButton/>

            {tabs.length > 0 && (
                <SideNavDivider/>
            )}

            <div className={classes.buttons}>
                {tabs.map(toNavButton)}
            </div>

            <div style={{marginBottom: '5px'}}>
                <SideNavDivider/>
                <SettingsButton/>
            </div>

        </div>
    );

});
