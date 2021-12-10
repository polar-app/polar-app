import * as React from 'react';
import {DocMetadataEditorStory} from "./impl/DocMetadataEditorStory";
import {MUIAppRoot} from "../../web/js/mui/MUIAppRoot";
import {DockLayout} from "../../web/js/ui/doc_layout/DockLayout";
import {deepMemo} from "../../web/js/react/ReactUtils";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {BrowserRouter, useHistory, useLocation} from 'react-router-dom';
import {PDFThumbnailerStory} from "./impl/PDFThumbnailerStory";
import Box from '@material-ui/core/Box';
import {EPUBThumbnailerStory} from "./impl/EPUBThumbnailerStory";
import {ReviewerStory} from "./impl/ReviewerStory";
import {DocCardStory} from "./impl/DocCardStory";
import {DocColumnsStory} from "./impl/DocColumnsStory";
import {IntersectionListStory} from './impl/IntersectionListStory';
import {IntersectionListTableStory} from './impl/IntersectionListTableStory';
import {MUIImageBottomFadeStory} from "./impl/MUIImageBottomFadeStory";
import {MUITooltipStory} from "./impl/MUITooltipStory";
import {MUIPaletteStory} from './impl/MUIPaletteStory';
import {HeightFitImgStory} from './impl/HeightFitImgStory';
import {ActionMenuStory} from "./impl/ActionMenuStory";
import {YoutubePlayerStory} from "./impl/YoutubePlayerStory";
import {AutoFlashcardsStory} from "./impl/AutoFlashcardsStory";
import {ProgressButtonStory} from './impl/ProgressButtonStory';
import {FunctionalChildStory} from "./impl/FunctionalChildStory";
import {UnmountComponentStory} from './impl/UnmountComponentStory';
import {AbortedRenderStory} from './impl/AbortedRenderStory';
import {FontAwesomeIconStory} from "./impl/FontAwesomeIconStory";
import {AccountVerificationStory} from './impl/AccountVerificationStory';
import {WelcomeStory} from "./impl/WelcomeStory";
import {MUICommandMenuStory} from "./impl/MUICommandMenuStory";
import {NestedContextStory} from './impl/NestedContextStory';
import {CreateAccountScreenStory} from "./impl/CreateAccountScreenStory";
import {MUICommandActionMenuStory} from './impl/MUICommandActionMenuStory';
import {ExportDefaultComponentStory} from "./impl/ExportDefaultComponentStory";
import {VerticalDynamicScrollerStory} from './impl/VerticalDynamicScrollerStory';
import {GraphVisualization} from './impl/GraphVisualization';
import {FeedbackButtonStory} from "./impl/FeedbackButtonStory";
import {AdaptivePageLayoutStory} from './impl/AdaptivePageLayoutStory';
import {AutoHideOnScrollStory} from "./impl/AutoHideOnScrollStory";
import {PBEmailAndReferral, RegisterForBetaError, RegisterForBetaPending} from './impl/PrivateBetaRegisteration';
import {MigrationToBlockAnnotationsMainStory} from "./impl/MigrationToBlockAnnotationsMainStory";
import {MUIAnchorButtonStory} from '../../web/js/mui/MUIAnchorButtonStory';
import {MUIAnchorStory} from '../../web/js/mui/MUIAnchorStory';
import {SettingsScreenStory} from "./impl/SettingsScreenStory";
import {FeatureStory} from "./impl/FeatureStory";

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
        name: "MigrationToBlockAnnotationsMain",
        component: <MigrationToBlockAnnotationsMainStory/>
    },
    {
        name: "MUIAnchor",
        component: <MUIAnchorStory/>
    },
    {
        name: "MUIAnchorButton",
        component: <MUIAnchorButtonStory/>
    },
    {
        name: "New Settings Component",
        component: <SettingsScreenStory/>
    },
    {
        name: "Auth Hide on Scroll",
        component: <AutoHideOnScrollStory/>
    },
    {
        name: "VerticalDynamicScroller",
        component: <VerticalDynamicScrollerStory/>
    },
    {
        name: 'Account Verification',
        component: <AccountVerificationStory/>
    },
    {
        name: 'FontAwesomeIconStory',
        component: <FontAwesomeIconStory/>
    },
    {
        name: 'Welcome Story',
        component: <WelcomeStory/>
    },
    {
        name: "DocMetadataEditor",
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
        name: "Reviewer",
        component: <ReviewerStory/>
    },
    {
        name: "Doc Cards",
        component: <DocCardStory/>
    },
    {
        name: "DocColumnsSelector",
        component: <DocColumnsStory/>
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
        name: "MUIPalette",
        component: <MUIPaletteStory/>
    },
    {
        name: "HeightFitImg",
        component: <HeightFitImgStory/>
    },
    {
        name: "ActionMenu",
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
        name: 'FunctionalChild',
        component: <FunctionalChildStory/>
    },
    {
        name: 'UnmountComponent',
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
        name: 'CreateAccountScreen',
        component: <CreateAccountScreenStory/>
    },
    {
        name: "RegisterForBetaMain",
        component: <PBEmailAndReferral/>
    },
    {
        name: "RegisterForBetaPending",
        component: <RegisterForBetaPending/>
    },
    {
        name: "RegisterForBetaError",
        component: <RegisterForBetaError/>
    },
    {
        name: 'MUICommandActionMenu',
        component: <MUICommandActionMenuStory/>
    },
    {
        name: 'ExportDefaultComponent',
        component: <ExportDefaultComponentStory/>
    },
    {
      name: 'GraphVisualization',
      component: <GraphVisualization />,
    },
    {
        name: 'FeedbackButton',
        component: <FeedbackButtonStory />,
    },

    {
        name: 'AdaptivePageLayout',
        component: <AdaptivePageLayoutStory />,
    },
    {
        name: 'Feature',
        component: <FeatureStory />,
    },

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
        <Box style={{
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

                <DockLayout.Root dockPanels={[
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
                    <DockLayout.Main/>
                </DockLayout.Root>
            </BrowserRouter>

        </MUIAppRoot>
    );
}
