import React from 'react';
import isEqual from 'react-fast-compare';
import {DocumentSaved} from './DocumentSaved';
import { DocumentSaving } from './DocumentSaving';

interface IProps {
    readonly status: 'saved' | 'saving' | undefined;
}

export const DocumentWriteStatus = React.memo((props: IProps) => {

    const {status} = props;

    switch (status) {

        case "saved":
            return <DocumentSaved/>;
        case "saving":
            return <DocumentSaving/>;

        default:
            return null;

    }

}, isEqual);
