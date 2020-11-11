"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoriesApp = void 0;
const React = __importStar(require("react"));
const DocMetadataEditorStory_1 = require("./impl/DocMetadataEditorStory");
const MUIAppRoot_1 = require("../../web/js/mui/MUIAppRoot");
const DockLayout2_1 = require("../../web/js/ui/doc_layout/DockLayout2");
const ReactUtils_1 = require("../../web/js/react/ReactUtils");
const List_1 = __importDefault(require("@material-ui/core/List"));
const ListItem_1 = __importDefault(require("@material-ui/core/ListItem"));
const ListItemText_1 = __importDefault(require("@material-ui/core/ListItemText"));
const react_router_dom_1 = require("react-router-dom");
const PDFThumbnailerStory_1 = require("./impl/PDFThumbnailerStory");
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const CKEditor5Story_1 = require("./impl/CKEditor5Story");
const NotesStory_1 = require("./impl/NotesStory");
const EPUBThumbnailerStory_1 = require("./impl/EPUBThumbnailerStory");
const ReviewerStory_1 = require("./impl/ReviewerStory");
const DocCardStory_1 = require("./impl/DocCardStory");
const CachedSnapshotStory_1 = require("./impl/CachedSnapshotStory");
const SideNavStory_1 = require("./impl/SideNavStory");
const ElevationsStory_1 = require("./impl/ElevationsStory");
const DocColumnsStory_1 = require("./impl/DocColumnsStory");
const WhatsNewStory_1 = require("./impl/WhatsNewStory");
const ReactWindowStory_1 = require("./impl/ReactWindowStory");
const XGridStory_1 = __importDefault(require("./impl/XGridStory"));
const IntersectionListStory_1 = require("./impl/IntersectionListStory");
const IntersectionListTableStory_1 = require("./impl/IntersectionListTableStory");
const MUIImageBottomFadeStory_1 = require("./impl/MUIImageBottomFadeStory");
const MUITooltipStory_1 = require("./impl/MUITooltipStory");
function createStoryIndex(stories) {
    function toStoryWithID(story) {
        const id = story.name.toLowerCase().replace(/ /g, '-');
        return Object.assign(Object.assign({}, story), { id });
    }
    return stories.map(toStoryWithID);
}
const stories = createStoryIndex([
    {
        name: "Doc Metadata Editor",
        component: React.createElement(DocMetadataEditorStory_1.DocMetadataEditorStory, null)
    },
    {
        name: "PDF Thumbnailer",
        component: React.createElement(PDFThumbnailerStory_1.PDFThumbnailerStory, null)
    },
    {
        name: "EPUB Thumbnailer",
        component: React.createElement(EPUBThumbnailerStory_1.EPUBThumbnailerStory, null)
    },
    {
        name: "CKEditor5",
        component: React.createElement(CKEditor5Story_1.CKEditor5Story, null)
    },
    {
        name: "Notes",
        component: React.createElement(NotesStory_1.NotesStory, null)
    },
    {
        name: "Reviewer",
        component: React.createElement(ReviewerStory_1.ReviewerStory, null)
    },
    {
        name: "Doc Cards",
        component: React.createElement(DocCardStory_1.DocCardStory, null)
    },
    {
        name: "Cached Snapshot",
        component: React.createElement(CachedSnapshotStory_1.CachedSnapshotStory, null)
    },
    {
        name: "Side Nav",
        component: React.createElement(SideNavStory_1.SideNavStory, null),
        noMargin: true
    },
    {
        name: "Elevations",
        component: React.createElement(ElevationsStory_1.ElevationsStory, null)
    },
    {
        name: "DocColumnsSelector",
        component: React.createElement(DocColumnsStory_1.DocColumnsStory, null)
    },
    {
        name: "Whats New",
        component: React.createElement(WhatsNewStory_1.WhatsNewStory, null)
    },
    {
        name: "React Window",
        component: React.createElement(ReactWindowStory_1.ReactWindowStory, null),
        noMargin: true
    },
    {
        name: "XGrid",
        component: React.createElement(XGridStory_1.default, null),
        noMargin: true
    },
    {
        name: "Intersection List",
        component: React.createElement(IntersectionListStory_1.IntersectionListStory, null),
        noMargin: true
    },
    {
        name: "Intersection List Table",
        component: React.createElement(IntersectionListTableStory_1.IntersectionListTableStory, null),
        noMargin: true
    },
    {
        name: "MUIImageBottomFadeStory",
        component: React.createElement(MUIImageBottomFadeStory_1.MUIImageBottomFadeStory, null)
    },
    {
        name: "MUITooltip",
        component: React.createElement(MUITooltipStory_1.MUITooltipStory, null)
    }
]);
const StoriesSidebar = ReactUtils_1.deepMemo(() => {
    const history = react_router_dom_1.useHistory();
    const id = useLocationID();
    const handleClick = React.useCallback((story) => {
        history.push('/apps/stories/' + story.id);
    }, [history]);
    const toListItem = React.useCallback((story) => {
        return (React.createElement(ListItem_1.default, { button: true, key: story.id, selected: story.id === id, onClick: () => handleClick(story) },
            React.createElement(ListItemText_1.default, { primary: story.name })));
    }, [handleClick, id]);
    return (React.createElement(List_1.default, { component: "nav", "aria-label": "stories" }, stories.map(toListItem)));
});
const StoryView = ReactUtils_1.deepMemo((props) => {
    return (props.story.component);
});
function useLocationID() {
    const location = react_router_dom_1.useLocation();
    if (!location.pathname) {
        console.log("useLocationID: no pathname");
        return undefined;
    }
    if (location.pathname.indexOf('/stories/') === -1) {
        console.log("useLocationID: Stories not in path");
        return undefined;
    }
    const id = location.pathname.split('/')[3];
    console.log("Returning ID: " + id);
    return id;
}
const StoryViewRoute = ReactUtils_1.deepMemo(() => {
    const id = useLocationID();
    console.log("Routing to story ID: ", id);
    if (!id) {
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
    return (React.createElement(Box_1.default, { m: story.noMargin ? 0 : 1, style: {
            flexGrow: 1,
            display: 'flex'
        } },
        React.createElement(StoryView, { story: story })));
});
const StoriesRouter = ReactUtils_1.deepMemo(() => {
    return (React.createElement(StoryViewRoute, null));
});
exports.StoriesApp = () => {
    return (React.createElement(MUIAppRoot_1.MUIAppRoot, null,
        React.createElement(react_router_dom_1.BrowserRouter, null,
            React.createElement(DockLayout2_1.DockLayout2, { dockPanels: [
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
                        component: (React.createElement(StoriesSidebar, null)),
                        width: 410,
                    },
                    {
                        id: "dock-panel-viewer",
                        type: 'grow',
                        style: {
                            display: 'flex'
                        },
                        component: (React.createElement(StoriesRouter, null))
                    }
                ] }))));
};
//# sourceMappingURL=StoriesApp.js.map