import React from 'react';
import isEqual from "react-fast-compare";
import {MUIAppRoot} from "../../../web/js/mui/MUIAppRoot";
import {UserTagsProvider} from "../../repository/js/persistence_layer/UserTagsProvider2";
import {DocViewer} from "./DocViewer";
import {AnnotationSidebarStoreProvider} from './AnnotationSidebarStore';
import {MUIDialogController} from "../../../web/js/mui/dialogs/MUIDialogController";
import {DocMetaContextProvider} from "../../../web/js/annotation_sidebar/DocMetaContextProvider";
import {DocViewerStore} from "./DocViewerStore";
import { DocFindStore } from './DocFindStore';
import {DocViewerDocMetaLookupContextProvider} from "./DocViewerDocMetaLookupContextProvider";

export const DocViewerScreen = React.memo(() => {

    return (
            <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                 }}>

                <MUIAppRoot>
                    
                    <MUIDialogController>
                            <UserTagsProvider>
                                <DocMetaContextProvider>
                                    <DocViewerStore>
                                        <DocViewerDocMetaLookupContextProvider>
                                            <DocFindStore>
                                                <AnnotationSidebarStoreProvider>
                                                    <DocViewer/>
                                                </AnnotationSidebarStoreProvider>
                                            </DocFindStore>
                                        </DocViewerDocMetaLookupContextProvider>
                                    </DocViewerStore>
                                </DocMetaContextProvider>
                            </UserTagsProvider>
                    </MUIDialogController>

                </MUIAppRoot>

            </div>

    );
}, isEqual);
