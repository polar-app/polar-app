import React from 'react';
import {DocumentSaved} from './DocumentSaved';
import {DocumentSaving} from './DocumentSaving';
import {useDocViewerStore} from '../../../../../apps/doc/src/DocViewerStore';
import {deepMemo} from "../../../react/ReactUtils";

export const DocumentWriteStatus = deepMemo(function DocumentWriteStatus() {

    const {hasPendingWrites} = useDocViewerStore(['hasPendingWrites']);
    // const online = useOnline();
    //
    // if (! online) {
    //     return <CloudOffline/>;
    // }

    switch (hasPendingWrites) {

        case true:
            return <DocumentSaving/>;

        case false:
            return <DocumentSaved/>;

        default:
            return null;

    }

});
