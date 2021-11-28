import * as React from 'react';
import ReactDOM from 'react-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {useSideNavStore} from './SideNavStore';
import Divider from '@material-ui/core/Divider';
import {PolarSVGIcon} from "../ui/svg_icons/PolarSVGIcon";
import {useHistory} from 'react-router-dom';
import TimelineIcon from '@material-ui/icons/Timeline';
import {ActiveTabButton} from "./ActiveTabButton";
import SettingsIcon from '@material-ui/icons/Settings';
import NoteIcon from '@material-ui/icons/Note';
import NotesIcon from '@material-ui/icons/Notes';
import DescriptionIcon from '@material-ui/icons/Description';
import {createContextMenu} from "../../../apps/repository/js/doc_repo/MUIContextMenu2";
import {SideNavContextMenu} from "./SideNavContextMenu";
import {SideNavButton} from "./SideNavButton";
import {AccountAvatar} from "../ui/cloud_auth/AccountAvatar";
import SyncIcon from '@material-ui/icons/Sync';
import {useAnkiSyncCallback} from "./AnkiSyncHook";
import {SwitchToOpenDocumentKeyboardCommand} from "./SwitchToOpenDocumentKeyboardCommand";
import {ZenModeActiveContainer} from "../mui/ZenModeActiveContainer";
import {SideNavQuestionButton} from './SideNavQuestionButton';
import {VerticalDynamicScroller} from './DynamicScroller';
import {observer} from "mobx-react-lite"
import {URLPathStr} from 'polar-shared/src/url/PathToRegexps';
import {Devices} from 'polar-shared/src/util/Devices';
import {usePersistentRouteContext} from '../apps/repository/PersistentRoute';
import {RoutePathNames} from '../apps/repository/RoutePathNames';
import {debounce, Theme} from '@material-ui/core';
import {SideNavInitializer} from './SideNavInitializer';
import {DeviceRouter} from '../ui/DeviceRouter';
import {MUICalendarMonthDayIcon} from '../mui/MUICalendarMonthDayIcon';
import {WithNotesIntegration} from '../notes/NoteUtils';

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
            height: '55px',
            flex: '0 0 55px',
            alignItems: 'center',
            "& *": {
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        dividerTop: {
            marginTop: 0,
            marginBottom: '5px',
            margin: theme.spacing(1),
            height: '1px'
        },
        divider: {
            marginBottom: '5px',
            margin: theme.spacing(1),
            height: '1px'
        },
        buttons: {
            flexGrow: 1,
            minHeight: 0,
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
    readonly onClick?: React.MouseEventHandler<HTMLElement>;
    readonly title: string;
    readonly children: JSX.Element | string;
    readonly canonicalizer?: (path: URLPathStr) => URLPathStr;
}

export const SideNavHistoryButton = React.memo(function SideNavHistoryButton(props: HistoryButtonProps) {

    const {path, title, children, onClick, canonicalizer} = props;
    const history = useHistory();

    const handleClick = React.useCallback((e) => {
        if (onClick) {
            onClick(e);
        } else {
            history.push(path);
        }
    }, [history, onClick, path]);

    return (
        <ActiveTabButton title={title}
                         path={path}
                         canonicalizer={canonicalizer}
                         noContextMenu={true}
                         onClick={handleClick}>
            {children}
        </ActiveTabButton>
    )
});


const HomeButton = React.memo(function HomeButton() {

    const history = useHistory();
    const classes = useStyles();

    return (
        <ActiveTabButton title="Documents"
                         path={RoutePathNames.HOME}
                         noContextMenu={true}
                         onClick={() => history.push(RoutePathNames.HOME)}>
            <DescriptionIcon className={classes.secondaryIcon}/>
        </ActiveTabButton>
    )
});

const AnnotationsButton = React.memo(function AnnotationsButton() {

    const classes = useStyles();

    return (
        <SideNavHistoryButton title="Annotations"
                              path={RoutePathNames.ANNOTATIONS}>
            <NoteIcon className={classes.secondaryIcon}/>
        </SideNavHistoryButton>
    )
});

const DailyNotesButton = React.memo(function AnnotationsButton() {

    const classes = useStyles();

    return (
        <SideNavHistoryButton title="Daily Notes"
                              path={RoutePathNames.DAILY}>
            <MUICalendarMonthDayIcon className={classes.secondaryIcon}/>
        </SideNavHistoryButton>
    )
});

const NotesButton = observer(function NotesButton() {
    const classes = useStyles();

    return (
        <SideNavHistoryButton title="Notes"
                              path={RoutePathNames.NOTES}>
            <NotesIcon className={classes.secondaryIcon}/>
        </SideNavHistoryButton>
    );

});

const StatsButton = React.memo(function StatsButton() {

    const classes = useStyles();

    return (
        <SideNavHistoryButton title="Statistics"
                              path={RoutePathNames.STATISTICS}>
            <TimelineIcon className={classes.secondaryIcon}/>
        </SideNavHistoryButton>
    )
});

const AccountButton = React.memo(function AccountButton() {

    const classes = useStyles();

    return (
        <SideNavHistoryButton title="Account"
                              path={RoutePathNames.ACCOUNT}>
            <AccountAvatar className={classes.secondaryIcon} size='small'/>
        </SideNavHistoryButton>
    )
});

const SettingsButton = React.memo(function SettingsButton() {

    const classes = useStyles();

    return (
        <SideNavHistoryButton title="Settings"
                              path={RoutePathNames.SETTINGS}>
            <SettingsIcon className={classes.secondaryIcon}/>
        </SideNavHistoryButton>
    )
});


const PolarButton = React.memo(function PolarButton() {

    const classes = useStyles();
    const history = useHistory();

    const w = SIDENAV_WIDTH - 8 * 2; // The size of the hr divider below it

    return (
        <div className={classes.logo}
             onClick={() => history.push(RoutePathNames.HOME)}>
            <PolarSVGIcon width={ w } height={ w } />
        </div>
    );

})

const SyncButton = React.memo(function SyncButton() {

    const classes = useStyles();

    const ankiSyncCallback = useAnkiSyncCallback();

    return (
        <ActiveTabButton title="Sync"
                         path={RoutePathNames.ANKI_SYNC}
                         noContextMenu={true}
                         onClick={ankiSyncCallback}>
            <SyncIcon className={classes.secondaryIcon}/>
        </ActiveTabButton>
    )
});

const SideNavDividerTop = React.memo(function SideNavDividerTop() {

    const classes = useStyles();

    return (
        <Divider orientation="horizontal"
                 flexItem={true}
                 className={classes.dividerTop}/>
    )

});

const SideNavDivider = React.memo(function SideNavDivider() {

    const classes = useStyles();

    return (
        <Divider orientation="horizontal"
                 flexItem={true}
                 className={classes.divider}/>
    )

});

export const [SideNavContextMenuProvider, useSideNavContextMenu]
    = createContextMenu(SideNavContextMenu, {});

const useSideNavStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            ...(! Devices.isDesktop() && {
                position: 'absolute',
                zIndex: 0,
                height: '100%',
            })
        },
    })
);

const SIDENAV_WIDTH_PERCENTAGE = 87; // 87% of the screen width
const SIDENAV_WIDTH_MAX = 500;

export const useSidenavWidth = () => {
    const [sidenavWidth, setSidenavWidth] = React.useState(0);
    React.useEffect(() => {
        const calculateWidth = () => {
            setSidenavWidth(Math.min(
                (SIDENAV_WIDTH_PERCENTAGE / 100) * window.innerWidth,
                SIDENAV_WIDTH_MAX,
            ));
        };

        calculateWidth();
        const debounced = debounce(calculateWidth, 1000)

        window.addEventListener('resize', debounced);

        return () => window.removeEventListener('resize', debounced);
    }, [setSidenavWidth]);

    return sidenavWidth;
};

export const SideNav = React.memo(function SideNav() {

    const { tabs } = useSideNavStore(['tabs', 'isOpen']);
    const classes = useStyles();
    const sidenavClasses = useSideNavStyles();

    return (
        <>
            <SideNavInitializer />
            <div id="sidenav" className={sidenavClasses.root}>
                <SwitchToOpenDocumentKeyboardCommand/>

                {Devices.isDesktop() && (
                    <ZenModeActiveContainer>
                        <div className={classes.root} style={{ height: '100%' }}>

                            <PolarButton/>

                            <SideNavDividerTop/>

                            <HomeButton/>
                            <AnnotationsButton/>

                            <WithNotesIntegration>
                                <NotesButton />
                            </WithNotesIntegration>

                            <DeviceRouter desktop={<StatsButton/>} />


                            <WithNotesIntegration>
                                <SideNavDivider/>
                                <DailyNotesButton/>
                            </WithNotesIntegration>

                            {tabs.length > 0 && (
                                <SideNavDivider/>
                            )}

                            <VerticalDynamicScroller className={classes.buttons}>
                                {tabs.map(tab => <SideNavButton key={tab.id} tab={tab}/>)}
                            </VerticalDynamicScroller>

                            <div style={{marginBottom: '5px'}}>
                                <SideNavDivider/>
                                <DeviceRouter desktop={<SyncButton/>}/>
                                <AccountButton/>

                                <SideNavQuestionButton/>
                                <SettingsButton/>
                            </div>
                        </div>
                    </ZenModeActiveContainer>
                )}
                <Divider orientation="vertical" />
                <DeviceRouter handheld={<div id="sidenav-sidecar" style={{ flex: 1 }} />} />
            </div>
        </>
    );

});

const useSideCarStyles = makeStyles<Theme, IUseSideCarStylesProps>(() =>
    createStyles({
        root({ sidenavWidth }) {
            return {
                height: '100%',
                width: Devices.isDesktop() ? `calc(${sidenavWidth}px - ${SIDENAV_WIDTH}px)`: `${sidenavWidth}px`,
            };
        },
    })
);


interface IUseSideCarStylesProps {
    sidenavWidth: number;
}

export const SideCar: React.FC = ({ children }) => {
    const sidenavWidth = useSidenavWidth();
    const classes = useSideCarStyles({ sidenavWidth });
    const mountElem = React.useMemo(() => document.querySelector<HTMLDivElement>('#sidenav-sidecar'), []);
    const {active} = usePersistentRouteContext();

    if (! mountElem || ! active) { // This technically would never happen.
        return null;
    }

    return ReactDOM.createPortal(<div className={classes.root} children={children} />, mountElem);
};
