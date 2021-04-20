import * as React from 'react';
import {DocMetadataEditorStory} from "./impl/DocMetadataEditorStory";
import {MUIAppRoot} from "../../web/js/mui/MUIAppRoot";
import {DockLayout2} from "../../web/js/ui/doc_layout/DockLayout2";
import {deepMemo} from "../../web/js/react/ReactUtils";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {BrowserRouter, useHistory, useLocation} from 'react-router-dom';
import {PDFThumbnailerStory} from "./impl/PDFThumbnailerStory";
import Box from '@material-ui/core/Box';
import {NotesStory} from "./impl/NotesStory";
import {EPUBThumbnailerStory} from "./impl/EPUBThumbnailerStory";
import {ReviewerStory} from "./impl/ReviewerStory";
import {DocCardStory} from "./impl/DocCardStory";
import {CachedSnapshotStory} from "./impl/CachedSnapshotStory";
import {SideNavStory} from "./impl/SideNavStory";
import {ElevationsStory} from "./impl/ElevationsStory";
import {DocColumnsStory} from "./impl/DocColumnsStory";
import {WhatsNewStory} from "./impl/WhatsNewStory";
import {ReactWindowStory} from "./impl/ReactWindowStory";
import XGridStory from "./impl/XGridStory";
import { IntersectionListStory } from './impl/IntersectionListStory';
import { IntersectionListTableStory } from './impl/IntersectionListTableStory';
import {MUIImageBottomFadeStory} from "./impl/MUIImageBottomFadeStory";
import {MUITooltipStory} from "./impl/MUITooltipStory";
import { MUIPaletteStory } from './impl/MUIPaletteStory';
import { FirestoreSnapshotsStory } from './impl/FirestoreSnapshotsStory';
import { HeightFitImgStory } from './impl/HeightFitImgStory';
import {FirestoreInitStory} from "./impl/FirestoreInitStory";
import {ActionMenuStory} from "./impl/ActionMenuStory";
import {YoutubePlayerStory} from "./impl/YoutubePlayerStory";
import {AutoFlashcardsStory} from "./impl/AutoFlashcardsStory";
import { ProgressButtonStory } from './impl/ProgressButtonStory';
import {FunctionalChildStory} from "./impl/FunctionalChildStory";
import { UnmountComponentStory } from './impl/UnmountComponentStory';
import {NotesComponentsStory} from "./impl/NotesComponentsStory";
import { AbortedRenderStory } from './impl/AbortedRenderStory';
import {ScratchStory} from "./impl/ScratchStory";
import { ErrorBoundaryStory } from './impl/ErrorBoundaryStory';
import {ActiveKeyboardShortcutsStory} from "./impl/ActiveKeyboardShortcutsStory";
import {FontAwesomeIconStory} from "./impl/FontAwesomeIconStory";
import { ProfileStory } from './impl/ProfileStory';
import { AccountVerificationStory } from './impl/AccountVerificationStory';
import {MobXStory} from "./impl/MobXStory";
import {WelcomeStory} from "./impl/WelcomeStory";
import {MUICommandMenuStory} from "./impl/MUICommandMenuStory";
import { NestedContextStory } from './impl/NestedContextStory';
import {CreateAccountStory} from "./impl/CreateAccountStory";
import {TextAreaMarkdownEditorStory} from "./impl/TextAreaMarkdownEditorStory";
import { MinimalContentEditablePerformanceStory } from './impl/MinimalContentEditablePerformanceStory';
import {MinimalContentEditableStory} from "./impl/MinimalContentEditableStory";
import { MUICommandActionMenuStory } from './impl/MUICommandActionMenuStory';
import ExportDefaultComponent from "./impl/ExportDefaultComponent";
import {ExportDefaultComponentStory} from "./impl/ExportDefaultComponentStory";
import {VerticalDynamicScrollerStory} from './impl/VerticalDynamicScrollerStory';

interface IStory {
    readonly name: string;
    readonly component: JSX.Element;
    readonly noMargin?: boolean;
}

interface IStoryWithID extends IStory {
    readonly id: string;
}

function createStoryIndex(stories: ReadonlyArray<IStory>) {

    function toStoryWithID(story: IStory): IStoryWithID {
        const id = story.name.toLowerCase().replace(/ /g, '-');
        return {...story, id};
    }

    return stories.map(toStoryWithID)

}

const stories = createStoryIndex([
    {
        name: "Vertical Dynamic Scroller",
        component: <VerticalDynamicScrollerStory/>
    },
    {
        name: "Scratch",
        component: <ScratchStory/>
    },
    {
        name: 'Account Verification',
        component: <AccountVerificationStory/>
    },
    {
        name: 'MobX',
        component: <MobXStory/>
    },
    {
        name: 'FontAwesomeIconStory',
        component: <FontAwesomeIconStory/>
    },
    {
        name: 'Profile Story',
        component: <ProfileStory/>
    },
    {
        name: 'Welcome Story',
        component: <WelcomeStory/>
    },
    {
        name: "Active Keyboard Shortcuts",
        component: <ActiveKeyboardShortcutsStory/>
    },
    {
        name: "Error Boundary",
        component: <ErrorBoundaryStory/>
    },
    {
        name: "Doc Metadata Editor",
        component: <DocMetadataEditorStory/>
    },
    {
        name: "PDF Thumbnailer",
        component: <PDFThumbnailerStory/>
    },
    {
        name: "EPUB Thumbnailer",
        component: <EPUBThumbnailerStory/>
    },
    {
        name: "Notes",
        component: <NotesStory/>
    },
    {
        name: "Notes Components",
        component: <NotesComponentsStory/>
    },
    {
        name: "Reviewer",
        component: <ReviewerStory/>
    },
    {
        name: "Doc Cards",
        component: <DocCardStory/>
    },
    {
        name: "Cached Snapshot",
        component: <CachedSnapshotStory/>
    },
    {
        name: "Side Nav",
        component: <SideNavStory/>,
        noMargin: true
    },
    {
        name: "Elevations",
        component: <ElevationsStory/>
    },
    {
        name: "DocColumnsSelector",
        component: <DocColumnsStory/>
    },
    {
        name: "Whats New",
        component: <WhatsNewStory/>
    },
    {
        name: "React Window",
        component: <ReactWindowStory/>,
        noMargin: true
    },
    {
        name: "XGrid",
        component: <XGridStory/>,
        noMargin: true
    },
    {
        name: "Intersection List",
        component: <IntersectionListStory/>,
        noMargin: true
    },
    {
        name: "Intersection List Table",
        component: <IntersectionListTableStory/>,
        noMargin: true
    },
    {
        name: "MUIImageBottomFadeStory",
        component: <MUIImageBottomFadeStory/>
    },
    {
        name: "MUITooltip",
        component: <MUITooltipStory/>
    },
    {
        name: "MUIPaletteStory",
        component: <MUIPaletteStory/>
    },
    {
        name: "FirestoreSnapshotsStory",
        component: <FirestoreSnapshotsStory/>
    },
    {
        name: "HeightFitImgStory",
        component: <HeightFitImgStory/>
    },
    {
        name: "Firebase Init",
        component: <FirestoreInitStory/>
    },
    {
        name: "ActionMenuStory",
        component: <ActionMenuStory/>
    },
    {
        name: "Youtube Player",
        component: <YoutubePlayerStory/>
    },
    {
        name: "Auto Flashcards",
        component: <AutoFlashcardsStory/>
    },
    {
        name: "Circular Progress",
        component: <ProgressButtonStory/>
    },
    {
        name: 'FunctionalChildStory',
        component: <FunctionalChildStory/>
    },
    {
        name: 'UnmountComponentStory',
        component: <UnmountComponentStory/>
    },
    {
        name: 'AbortedRenderStory',
        component: <AbortedRenderStory/>
    },
    {
        name: 'MUICommandMenu',
        component: <MUICommandMenuStory/>
    },
    {
        name: 'Nested Context',
        component: <NestedContextStory/>
    },
    {
        name: 'Create Account',
        component: <CreateAccountStory/>
    },
    {
        name: 'TextAreaMarkdownEditorStory',
        component: <TextAreaMarkdownEditorStory/>
    },
    {
        name: 'MinimalContentEditableStory',
        component: <MinimalContentEditableStory/>
    },
    {
        name: 'MinimalContentEditablePerformanceStory',
        component: <MinimalContentEditablePerformanceStory/>
    },
    {
        name: 'MUICommandActionMenuStory',
        component: <MUICommandActionMenuStory/>
    },
    {
        name: 'ExportDefaultComponentStory',
        component: <ExportDefaultComponentStory/>
    }


]);

const StoriesSidebar = deepMemo(function StoriesSidebar() {

    const history = useHistory();
    const id = useLocationID();

    const handleClick = React.useCallback((story: IStoryWithID) => {
        history.push('/apps/stories/' + story.id);
    }, [history]);

    const toListItem = React.useCallback((story: IStoryWithID) => {

        return (
            <ListItem button
                      key={story.id}
                      selected={story.id === id}
                      onClick={() => handleClick(story)}>
                <ListItemText primary={story.name} />
            </ListItem>
        );

    }, [handleClick, id]);

    return (
        <List component="nav" aria-label="stories">
            {stories.map(toListItem)}
        </List>
    );
});

interface StoryViewProps {
    readonly story: IStoryWithID;
}

const StoryView = deepMemo(function StoryView(props: StoryViewProps) {
    return (
        props.story.component
    );
});

function useLocationID(): string | undefined {

    const location = useLocation();

    if (! location.pathname) {
        console.log("useLocationID: no pathname");
        return undefined;
    }

    if (location.pathname.indexOf('/stories/') === -1)  {
        console.log("useLocationID: Stories not in path");
        return undefined;
    }

    const id = location.pathname.split('/')[3];

    console.log("Returning ID: " + id);

    return id;

}

const StoryViewRoute = deepMemo(function StoryViewRoute() {

    const id = useLocationID();

    console.log("Routing to story ID: ", id);

    if (! id) {
        console.warn("No id");
        return null;
    }

    console.log("Routing to story ID: ", id);

    const matchingStories = stories.filter(current => current.id === id);

    if (matchingStories.length === 0) {
        console.warn("No story for id: " + id);
        return null;
    }

    const story = matchingStories[0];

    return (
        <Box m={story.noMargin ? 0 : 1}
             style={{
                 flexGrow: 1,
                 display: 'flex'
             }}>

            <StoryView story={story}/>
        </Box>
    );

});

const StoriesRouter = deepMemo(function StoriesRouter() {
    return (
        // <Switch>
        //     <Route path="/id">
            <StoryViewRoute/>
        //     </Route>
        // </Switch>
    );
});

export const StoriesApp = () => {
    return (
        <MUIAppRoot>

            <BrowserRouter>

                <DockLayout2.Root dockPanels={[
                                    {
                                        id: "doc-panel-outline",
                                        type: 'fixed',
                                        side: 'left',
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minHeight: 0,
                                            flexGrow: 1
                                        },
                                        component: (
                                            <StoriesSidebar/>
                                        ),
                                        width: 410,
                                    },
                                    {
                                        id: "dock-panel-viewer",
                                        type: 'grow',
                                        style: {
                                            display: 'flex'
                                        },
                                        component: (
                                            <StoriesRouter/>
                                        )
                                    }
                                ]}>
                    <DockLayout2.Main/>
                </DockLayout2.Root>
            </BrowserRouter>

        </MUIAppRoot>
    );
}
