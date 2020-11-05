import * as React from 'react';
import {DocMetadataEditorStory} from "./impl/DocMetadataEditorStory";
import {MUIAppRoot} from "../../web/js/mui/MUIAppRoot";
import {DockLayout2} from "../../web/js/ui/doc_layout/DockLayout2";
import {deepMemo} from "../../web/js/react/ReactUtils";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {HashRouter, Route, Switch, useHistory, useLocation} from 'react-router-dom';
import { Arrays } from 'polar-shared/src/util/Arrays';
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

interface IStory {
    readonly name: string;
    readonly component: JSX.Element;
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
        component: <SideNavStory/>
    },
    {
        name: "Elevations",
        component: <ElevationsStory/>
    }

]);

const StoriesSidebar = deepMemo(() => {

    const history = useHistory();
    const id = useLocationID();

    const handleClick = React.useCallback((story: IStoryWithID) => {
        history.push('/id/' + story.id);
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
        return undefined;
    }

    if (! location.pathname.startsWith('/id/')) {
        return undefined;
    }

    return Arrays.last(location.pathname.split('/'));

}

const StoryViewRoute = deepMemo(() => {

    const id = useLocationID();

    if (! id) {
        console.warn("No id");
        return null;
    }

    const matchingStories = stories.filter(current => current.id === id);

    if (matchingStories.length === 0) {
        console.warn("No story for id: " + id);
        return null;
    }

    const story = matchingStories[0];

    return (
        <StoryView story={story}/>
    );

});

const StoriesRouter = deepMemo(() => {
    return (
        <Switch>
            <Route path="/id">
                <Box m={1}
                     style={{
                         flexGrow: 1,
                         display: 'flex'
                     }}>
                    <StoryViewRoute/>
                </Box>
            </Route>
        </Switch>
    );
});

export const App = () => {
    return (
        <MUIAppRoot>

            <HashRouter hashType="noslash">
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
            </HashRouter>

        </MUIAppRoot>
    );
}