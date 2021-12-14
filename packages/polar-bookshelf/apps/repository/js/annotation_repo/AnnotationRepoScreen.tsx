import * as React from 'react';
import useTheme from "@material-ui/core/styles/useTheme";
import {FixedNav} from '../FixedNav';
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {StartReviewDropdown} from "./filter_bar/StartReviewDropdown";
import {AnnotationRepoRoutedComponents} from './AnnotationRepoRoutedComponents';
import {StartReviewSpeedDial} from './StartReviewSpeedDial';
import {MUIElevation} from "../../../../web/js/mui/MUIElevation";
import {SidenavTriggerIconButton} from "../../../../web/js/sidenav/SidenavTriggerIconButton";
import {SideCar} from "../../../../web/js/sidenav/SideNav";
import {Box, createStyles, IconButton, makeStyles, SwipeableDrawer} from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";
import {BlocksAnnotationRepoTable} from '../block_annotation_repo/BlocksAnnotationRepoTable';
import {BlocksAnnotationInlineViewer} from '../block_annotation_repo/BlocksAnnotationInlineViewer';
import {BlocksAnnotationRepoFilterBar} from '../block_annotation_repo/BlocksAnnotationRepoFilterBar';
import {observer} from 'mobx-react-lite';
import {useBlocksAnnotationRepoStore} from '../block_annotation_repo/BlocksAnnotationRepoStore';
import {BlocksFolderSidebar} from '../folders/BlocksFolderSidebar';
import {RepositoryToolbar} from '../../../../web/js/apps/repository/RepositoryToolbar';

interface IToolbarProps {
    handleRightDrawerToggle?: () => void;
}

const Toolbar: React.FC<IToolbarProps> = React.memo(function Toolbar({ handleRightDrawerToggle }) {

    return (
        <RepositoryToolbar>

            <Box style={{
                display: 'flex',
                alignItems: 'center',
            }}>

                <SidenavTriggerIconButton />
                <div style={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                }}>
                    <BlocksAnnotationRepoFilterBar />
                    {handleRightDrawerToggle && (
                        <DeviceRouter phone={(
                            <IconButton onClick={handleRightDrawerToggle}>
                                <MenuIcon/>
                            </IconButton>
                        )}/>
                    )}
                </div>

            </Box>

        </RepositoryToolbar>
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
        isAnnotationViewerOpen: boolean;
        setIsAnnotationViewerOpen: (state: boolean) => void;
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
        const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();

        const annotation = React.useMemo(() => {
            return blocksAnnotationRepoStore.activeBlock;
        }, [blocksAnnotationRepoStore.activeBlock]);

        const classes = useStyles();

        React.useEffect(() => {
            if (annotation) {
                setIsAnnotationViewerOpen(true);
            }
        }, [setIsAnnotationViewerOpen, annotation]);


        return (
            <>
                <BlocksAnnotationRepoTable />

                <SwipeableDrawer
                    anchor="right"
                    open={isAnnotationViewerOpen}
                    onClose={handleDrawerStateChange(false)}
                    onOpen={handleDrawerStateChange(true)}
                    className={classes.drawer}
                    classes={{ root: classes.drawer, paper: classes.drawer }}>

                    <BlocksAnnotationInlineViewer />

                </SwipeableDrawer>
            </>
        );
    });

}

namespace Tablet {


    export const Main = () => {

        return (
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
                    component: <BlocksAnnotationRepoTable />,
                    width: 400
                },
                {
                    id: 'dock-panel-right',
                    type: 'grow',
                    component: <BlocksAnnotationInlineViewer />,
                }
            ]}>
                <DockLayout.Main/>
            </DockLayout.Root>
        );
    };


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
                                <BlocksAnnotationRepoTable />
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
                                <BlocksAnnotationInlineViewer />
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
                        <BlocksFolderSidebar header={<StartReviewHeader/>} />
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
                            <BlocksFolderSidebar header={<StartReviewHeader/>} />
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
