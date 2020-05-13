import React from 'react';
import isEqual from "react-fast-compare";
import {MUIAppRoot} from "../../../web/js/mui/MUIAppRoot";
import {UserTagsProvider} from "../../repository/js/persistence_layer/UserTagsProvider2";
import {DocViewer} from "./DocViewer";
import {AnnotationSidebarStoreProvider} from './AnnotationSidebarStore';
import {MUIDialogController} from "../../../web/spectron0/material-ui/dialogs/MUIDialogController";
import {DocMetaContextProvider} from "../../../web/js/annotation_sidebar/DocMetaContextProvider";
import {PersistenceLayerContext} from '../../repository/js/persistence_layer/PersistenceLayerApp';
import {DocViewerStore} from "./DocViewerStore";

export const DocViewerScreen = React.memo(() => {

    return (
            <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                 }}>

                <MUIAppRoot>

                    {/*FIXME we have to define usePersistence here too... */}

                    <MUIDialogController>
                            <UserTagsProvider>
                                <DocMetaContextProvider>
                                    <DocViewerStore>
                                        <AnnotationSidebarStoreProvider>
                                            <DocViewer/>
                                        </AnnotationSidebarStoreProvider>
                                    </DocViewerStore>
                                </DocMetaContextProvider>
                            </UserTagsProvider>
                    </MUIDialogController>

                </MUIAppRoot>

            </div>

    );
}, isEqual);
