import React, {useContext, useState} from 'react';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import isEqual from "react-fast-compare";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

/**
 * Holds the DocMeta and metadata about it including whether it's mutable or
 * not.
 */
export interface IDocMetaHolder {

    readonly docMeta: IDocMeta;

    /**
     * True if the user has permission to mutate this document.
     */
    readonly mutable: boolean;

}

export interface IDocMetaContext {
    readonly doc: IDocMetaHolder | undefined;
    readonly setDoc: (doc: IDocMetaHolder) => void;
}

const defaultValue: IDocMetaContext = {
    doc: undefined,
    setDoc: NULL_FUNCTION
}

export const DocMetaContext = React.createContext<IDocMetaContext>(defaultValue);

export function useDocMetaContext() {
    return useContext(DocMetaContext);
}

interface IProps {
    readonly doc?: IDocMetaHolder;
    readonly children: JSX.Element;
}

export const DocMetaContextProvider = React.memo(function DocMetaContextProvider(props: IProps) {

    const [doc, setDoc] = useState<IDocMetaHolder | undefined>(props.doc);

    return (
        <DocMetaContext.Provider value={{doc, setDoc}}>
            {props.children}
        </DocMetaContext.Provider>
    );

}, isEqual);
