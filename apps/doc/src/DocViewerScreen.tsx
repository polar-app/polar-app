import React from 'react';
import isEqual from "react-fast-compare";
import {MUIRepositoryRoot} from "../../../web/js/mui/MUIRepositoryRoot";
import {UserTagsProvider} from "../../repository/js/persistence_layer/UserTagsProvider2";
import {DocViewer} from "./DocViewer";
import {AnnotationSidebarStoreProvider} from './AnnotationSidebarStore';
import {DocMetaContextProvider} from "../../../web/js/annotation_sidebar/DocMetaContextProvider";
import {DocViewerStore} from "./DocViewerStore";
import {DocFindStore} from './DocFindStore';
import {DocViewerDocMetaLookupContextProvider} from "./DocViewerDocMetaLookupContextProvider";

export const DocViewerScreen = React.memo(() => {

    return (
            <div className="DocViewerScreen"
                 style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                 }}>

                <MUIRepositoryRoot>
                    
                    <UserTagsProvider>
                        <DocMetaContextProvider>
                            <DocViewerDocMetaLookupContextProvider>
                                <DocViewerStore>
                                    <DocFindStore>
                                        <AnnotationSidebarStoreProvider>
                                            <DocViewer/>
                                        </AnnotationSidebarStoreProvider>
                                    </DocFindStore>
                                </DocViewerStore>
                            </DocViewerDocMetaLookupContextProvider>
                        </DocMetaContextProvider>
                    </UserTagsProvider>

                </MUIRepositoryRoot>

            </div>

    );
}, isEqual);
