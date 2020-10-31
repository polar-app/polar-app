import * as React from 'react';
import {DocMetadataEditorStory} from "./impl/DocMetadataEditorStory";
import {MUIAppRoot} from "../../web/js/mui/MUIAppRoot";
import {DockLayout2} from "../../web/js/ui/doc_layout/DockLayout2";
import {deepMemo} from "../../web/js/react/ReactUtils";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

interface IStory {
    readonly name: string;
    readonly component: JSX.Element;
}

interface IStoryWithID extends IStory {
    readonly id: string;
}

function createStoryIndex(stories: ReadonlyArray<IStory>) {

    function toStoryWithID(story: IStory): IStoryWithID {
        const id = story.name.toLowerCase().replace(' ', '-');
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

    const toListItem = React.useCallback((story: IStoryWithID) => {
        return (
            <ListItem button key={story.id}>
                <ListItemText primary={story.name} />
            </ListItem>
        );

    }, []);

    return (
        <List component="nav" aria-label="stories">
            {stories.map(toListItem)}
        </List>
    );
});

const StoriesRouter = deepMemo(() => {
    return (
        <div>

        </div>
    );
});

export const App = () => {
    return (
        <MUIAppRoot>

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
                            <DocMetadataEditorStory/>
                        )
                    }
                ]}/>

        </MUIAppRoot>
    );
}