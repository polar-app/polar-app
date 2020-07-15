import React from 'react';
import isEqual from 'react-fast-compare';
import {DocumentSaved} from './DocumentSaved';
import {DocumentSaving} from './DocumentSaving';
import {useDocViewerStore} from '../../../../../apps/doc/src/DocViewerStore';
import {CloudOffline} from "./CloudOffline";
import {useOnline} from "./CloudConnectivityButton";

export const DocumentWriteStatus = React.memo(() => {

    const {hasPendingWrites} = useDocViewerStore();
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

}, isEqual);
