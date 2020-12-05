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
import {CKEditor5Story} from "./impl/CKEditor5Story";
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
        name: "CKEditor5",
        component: <CKEditor5Story/>
    },
    {
        name: "Notes",
        component: <NotesStory/>
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

]);

const StoriesSidebar = deepMemo(() => {

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

const StoryView = deepMemo((props: StoryViewProps) => {
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

const StoryViewRoute = deepMemo(() => {

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

const StoriesRouter = deepMemo(() => {
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
                <DockLayout2
                    dockPanels={[
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
                    ]}/>
            </BrowserRouter>

        </MUIAppRoot>
    );
}