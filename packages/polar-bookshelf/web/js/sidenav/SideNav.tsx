import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {useSideNavStore, TabDescriptor} from './SideNavStore';
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
import { Intercom } from '../apps/repository/integrations/Intercom';
import { SideNavQuestionButton } from './SideNavQuestionButton';
import {VerticalDynamicScroller} from './DynamicScroller';
import {DateContents} from "../notes/content/DateContents";
import {useBlocksStore} from "../notes/store/BlocksStore";
import { observer } from "mobx-react-lite"
import { autorun } from 'mobx'
import {URLPathStr} from 'polar-shared/src/url/PathToRegexps';

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

export function useNotesEnabled() {
    return localStorage.getItem('notes.enabled') === 'true';
}

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
    }, [history, onClick]);

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
                         path="/"
                         noContextMenu={true}
                         onClick={() => history.push('/')}>
            <DescriptionIcon className={classes.secondaryIcon}/>
        </ActiveTabButton>
    )
});

const AnnotationsButton = React.memo(function AnnotationsButton() {

    const classes = useStyles();

    return (
        <SideNavHistoryButton title="Annotations"
                              path="/annotations">
            <NoteIcon className={classes.secondaryIcon}/>
        </SideNavHistoryButton>
    )
});

const NotesButton = observer(function NotesButton() {
    const classes = useStyles();
    const blocksStore = useBlocksStore();
    const history = useHistory();

    const handleClick = React.useCallback(() => {
        if (! blocksStore.hasSnapshot) {
            // dont' do anything yet.
            return;
        }
        const dateContent = DateContents.create();

        const block = blocksStore.getBlockByName(dateContent.data);

        if (! block) {
            blocksStore.createNewNamedBlock(dateContent.data, {type: 'date'});
        }
        history.push(`/notes/${dateContent.data}`);
    }, [blocksStore, history]);

    const pathCanonicalizer = React.useCallback(path => path.startsWith('/notes') ? '/notes' : path, []);

    if (! blocksStore.hasSnapshot) {
        // dont' do anything yet.
        return null;
    }

    return (
        <SideNavHistoryButton title="Notes"
                              onClick={handleClick}
                              canonicalizer={pathCanonicalizer}
                              path="/notes">
            <NotesIcon className={classes.secondaryIcon}/>
        </SideNavHistoryButton>
    );

});

const StatsButton = React.memo(function StatsButton() {

    const classes = useStyles();

    return (
        <SideNavHistoryButton title="Statistics"
                              path="/stats">
            <TimelineIcon className={classes.secondaryIcon}/>
        </SideNavHistoryButton>
    )
});

const AccountButton = React.memo(function AccountButton() {

    const classes = useStyles();

    return (
        <SideNavHistoryButton title="Account"
                              path="#account">
            <AccountAvatar className={classes.secondaryIcon}/>
        </SideNavHistoryButton>
    )
});

const SettingsButton = React.memo(function SettingsButton() {

    const classes = useStyles();

    return (
        <SideNavHistoryButton title="Settings"
                              path="/settings">
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
             onClick={() => history.push('')}>
            <PolarSVGIcon width={ w } height={ w } />
        </div>
    );

})

const SyncButton = React.memo(function SyncButton() {

    const classes = useStyles();

    const ankiSyncCallback = useAnkiSyncCallback();

    return (
        <ActiveTabButton title="Sync"
                         path="/sync"
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
    = createContextMenu(SideNavContextMenu, {name: 'sidenav'});

export const SideNav = React.memo(function SideNav() {

    const classes = useStyles();

    const {tabs} = useSideNavStore(['tabs']);

    const notesEnabled = useNotesEnabled();

    return (
        <>
            <SwitchToOpenDocumentKeyboardCommand/>

            <Intercom/>

            <ZenModeActiveContainer>
                <div className={classes.root}>

                    <PolarButton/>

                    <SideNavDividerTop/>

                    <HomeButton/>
                    <AnnotationsButton/>

                    {notesEnabled && (
                        <NotesButton/>
                    )}

                    <StatsButton/>

                    {tabs.length > 0 && (
                        <SideNavDivider/>
                    )}

                    <VerticalDynamicScroller className={classes.buttons}>
                        {tabs.map(tab => <SideNavButton key={tab.id} tab={tab}/>)}
                    </VerticalDynamicScroller>

                    <div style={{marginBottom: '5px'}}>
                        <SideNavDivider/>
                        <SyncButton/>
                        <AccountButton/>
                        <SideNavQuestionButton/>
                        <SettingsButton/>
                    </div>

                </div>
            </ZenModeActiveContainer>
        </>
    );

});
