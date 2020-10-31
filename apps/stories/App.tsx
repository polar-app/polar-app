import * as React from 'react';
import {DocMetadataEditorStory} from "./impl/DocMetadataEditorStory";
import {MUIAppRoot} from "../../web/js/mui/MUIAppRoot";
import {DockLayout2} from "../../web/js/ui/doc_layout/DockLayout2";
import {deepMemo} from "../../web/js/react/ReactUtils";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {HashRouter, Route, Switch, useHistory} from 'react-router-dom';

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
    }
]);

const StoriesSidebar = deepMemo(() => {

    const history = useHistory();

    const handleClick = React.useCallback((story: IStoryWithID) => {
        history.push('#id=' + story.id);
    }, [history]);

    const toListItem = React.useCallback((story: IStoryWithID) => {

        return (
            <ListItem button key={story.id} onClick={() => handleClick(story)}>
                <ListItemText primary={story.name} />
            </ListItem>
        );

    }, [handleClick]);

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

const StoryViewRoute = deepMemo(() => {

    return (
        <div>
            this is a route
        </div>
    );

});

const StoriesRouter = deepMemo(() => {
    return (
        <Switch>
            <Route exact path="/id">
                <StoryViewRoute/>
            </Route>
        </Switch>
    );
});

export const App = () => {
    return (
        <MUIAppRoot>

            <HashRouter>
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