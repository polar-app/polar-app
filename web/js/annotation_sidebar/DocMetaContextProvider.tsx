import React, {useContext} from 'react';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

interface IDoc {
    readonly docMeta: IDocMeta;

    /**
     * True if the user has permission to mutate this document.
     */
    readonly mutable: boolean;
}

export const DocMetaContext = React.createContext<IDoc>(null!);

export function useDocMetaContext() {
    return useContext(DocMetaContext);
}

