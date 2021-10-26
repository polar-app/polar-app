import * as React from 'react';
import useTheme from "@material-ui/core/styles/useTheme";
import {FixedNav} from '../FixedNav';
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import {FolderSidebar2} from "../folders/FolderSidebar2";
import {AnnotationListView} from "./AnnotationListView";
import {AnnotationRepoFilterBar} from "./AnnotationRepoFilterBar";
import {AnnotationInlineViewer} from "./AnnotationInlineViewer";
import {StartReviewDropdown} from "./filter_bar/StartReviewDropdown";
import {AnnotationRepoRoutedComponents} from './AnnotationRepoRoutedComponents';
import {StartReviewSpeedDial} from './StartReviewSpeedDial';
import {MUIElevation} from "../../../../web/js/mui/MUIElevation";
import {SidenavTriggerIconButton} from "../../../../web/js/sidenav/SidenavTriggerIconButton";
import {SideCar} from "../../../../web/js/sidenav/SideNav";
import {createStyles, IconButton, makeStyles, SwipeableDrawer} from '@material-ui/core';
import {useAnnotationRepoStore} from './AnnotationRepoStore';
import MenuIcon from "@material-ui/icons/Menu";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";
import {BlocksAnnotationRepoTable} from '../block_annotation_repo/BlocksAnnotationRepoTable';
import {AnnotationRepoTable} from './AnnotationRepoTable';
import {BlocksAnnotationInlineViewer} from '../block_annotation_repo/BlocksAnnotationInlineViewer';
import {BlocksAnnotationRepoFilterBar} from '../block_annotation_repo/BlocksAnnotationRepoFilterBar';
import {NEW_NOTES_ANNOTATION_BAR_ENABLED} from '../../../doc/src/DocViewer';
import {observer} from 'mobx-react-lite';
import {useBlocksAnnotationRepoStore} from '../block_annotation_repo/BlocksAnnotationRepoStore';

interface IToolbarProps {
    readonly handleRightDrawerToggle?: () => void;
}

const Toolbar: React.FC<IToolbarProps> = React.memo(function Toolbar({ handleRightDrawerToggle }) {
    return (
        <MUIPaperToolbar id="header-filter"
                         padding={1}>

            <div style={{
                display: 'flex',
                alignItems: 'center'
            }}>

                <SidenavTriggerIconButton />
                <div style={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                }}>
                    {
                        NEW_NOTES_ANNOTATION_BAR_ENABLED
                            ? <BlocksAnnotationRepoFilterBar />
                            : <AnnotationRepoFilterBar />
                    }
                    {handleRightDrawerToggle && (
                        <DeviceRouter phone={(
                            <IconButton onClick={handleRightDrawerToggle}>
                                <MenuIcon/>
                            </IconButton>
                        )}/>
                    )}
                </div>

            </div>

        </MUIPaperToolbar>
    );
});



const StartReviewHeader = () => {

    const theme = useTheme();

    return (
        <div style={{ flexGrow: 1 }}>
            <StartReviewDropdown style={{
                width: '100%',
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(1)
            }}/>
        </div>
    );

};

namespace Phone {

    interface IMainProps {
        readonly isAnnotationViewerOpen: boolean;
        readonly setIsAnnotationViewerOpen: (state: boolean) => void;
    }

    const useStyles = makeStyles(() =>
        createStyles({
            drawer: {
                maxWidth: '500px',
                width: '100%',
            },
        })
    );

    export const Main: React.FC<IMainProps> = observer(({ isAnnotationViewerOpen, setIsAnnotationViewerOpen }) => {
        const handleDrawerStateChange = (state: boolean) => () => setIsAnnotationViewerOpen(state);
        const {selected, view} = useAnnotationRepoStore(['selected', 'view']);
        const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();


        const annotation = React.useMemo(() => {
            if (NEW_NOTES_ANNOTATION_BAR_ENABLED) {
                return blocksAnnotationRepoStore.activeBlock;
            } else {
                return selected.length > 0
                    ? view.filter(current => current.id === selected[0])[0]
                    : undefined;
            }
        }, [blocksAnnotationRepoStore.activeBlock, selected, view]);

        const classes = useStyles();

        React.useEffect(() => {
            if (annotation) {
                setIsAnnotationViewerOpen(true);
            }
        }, [setIsAnnotationViewerOpen, annotation]);


        return (
            <>
                {NEW_NOTES_ANNOTATION_BAR_ENABLED
                    ? <BlocksAnnotationRepoTable />
                    : <AnnotationListView />
                }
                <SwipeableDrawer
                    anchor="right"
                    open={isAnnotationViewerOpen}
                    onClose={handleDrawerStateChange(false)}
                    onOpen={handleDrawerStateChange(true)}
                    className={classes.drawer}
                    classes={{ root: classes.drawer, paper: classes.drawer }}
                >
                    {NEW_NOTES_ANNOTATION_BAR_ENABLED
                        ? <BlocksAnnotationInlineViewer />
                        : <AnnotationInlineViewer />
                    }
                </SwipeableDrawer>
            </>
        );
    });

}

namespace Tablet {


    export const Main = () => (
        <DockLayout.Root dockPanels={[
            {
                id: 'dock-panel-center',
                type: 'fixed',
                style: {
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                },
                component: NEW_NOTES_ANNOTATION_BAR_ENABLED ? <BlocksAnnotationRepoTable /> : <AnnotationRepoTable />,
                width: 400
            },
            {
                id: 'dock-panel-right',
                type: 'grow',
                component: NEW_NOTES_ANNOTATION_BAR_ENABLED ? <BlocksAnnotationInlineViewer /> : <AnnotationInlineViewer />,
            }
        ]}>
            <DockLayout.Main/>
        </DockLayout.Root>
    );


}

namespace Desktop {

    const Right = React.memo(function Right() {

        return (
            <div style={{
                     display: 'flex',
                     flexGrow: 1,
                     flexDirection: 'column',
                     minHeight: 0,
                     minWidth: 0
                 }}>

                <Toolbar/>

                <DockLayout.Root dockPanels={[
                    {
                        id: 'dock-panel-center',
                        type: 'fixed',
                        style: {
                            overflow: 'visible',
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            minHeight: 0,
                        },
                        component:
                            <div style={{
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0
                            }}>
                                {NEW_NOTES_ANNOTATION_BAR_ENABLED
                                    ? <BlocksAnnotationRepoTable />
                                    : <AnnotationRepoTable />
                                }
                            </div>,
                        width: 450
                    },
                    {
                        id: 'dock-panel-right',
                        type: 'grow',
                        style: {
                            display: 'flex'
                        },
                        component:
                            <MUIElevation elevation={0}
                                          style={{
                                              flexGrow: 1,
                                              display: 'flex'
                                          }}>
                                {NEW_NOTES_ANNOTATION_BAR_ENABLED
                                    ? <BlocksAnnotationInlineViewer />
                                    : <AnnotationInlineViewer />
                                }
                            </MUIElevation>

                    }
                ]}>
                    <DockLayout.Main />
                </DockLayout.Root>
            </div>

        );
    });


    export const Main = () => {

        return (
            <DockLayout.Root dockPanels={[
                {
                    id: 'dock-panel-left',
                    type: 'fixed',
                    style: {
                        overflow: 'visible',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        minHeight: 0,
                    },
                    component: (
                        <FolderSidebar2 header={<StartReviewHeader/>}/>
                    ),
                    width: 300
                },
                {
                    id: 'dock-panel-right',
                    type: 'grow',
                    style: {
                        display: 'flex'
                    },
                    component:
                        <Right/>

                }
            ]}>
                <DockLayout.Main />
            </DockLayout.Root>
        );
    };

}

namespace screen {

    export const HandheldScreen = () => {
        const [isAnnotationViewerOpen, setIsAnnotationViewerOpen] = React.useState(false);

        return (

            <FixedNav id="doc-repository"
                      className="annotations-view">

                <AnnotationRepoRoutedComponents/>

                <FixedNav.Body>
                    <div style={{
                             flexGrow: 1,
                             display: 'flex',
                             flexDirection: 'column',
                             minHeight: 0,
                             maxWidth: '100%',
                         }}>

                        <Toolbar handleRightDrawerToggle={() => setIsAnnotationViewerOpen(state => ! state)}/>
                        <StartReviewSpeedDial/>
                        <SideCar>
                            <FolderSidebar2 header={<StartReviewHeader/>}/>
                        </SideCar>

                        <DeviceRouter phone={
                                          <Phone.Main
                                              isAnnotationViewerOpen={isAnnotationViewerOpen}
                                              setIsAnnotationViewerOpen={setIsAnnotationViewerOpen}
                                          />
                                      }
                                      handheld={<Tablet.Main />}/>

                    </div>
                </FixedNav.Body>

            </FixedNav>

        );
    };

    export const DesktopScreen = () => (

        <FixedNav id="doc-repository"
                  className="annotations-view">

            <header>

            </header>

            <AnnotationRepoRoutedComponents/>
            <Desktop.Main />

        </FixedNav>

    );

}

export const AnnotationRepoScreen = React.memo(() => (

    <>

        <DeviceRouter desktop={<screen.DesktopScreen/>}
                      handheld={<screen.HandheldScreen/>}/>

    </>
));
