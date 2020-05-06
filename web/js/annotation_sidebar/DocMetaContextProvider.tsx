import React, {useContext, useState} from 'react';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import isEqual from "react-fast-compare";

export interface IDocMetaContextBase {

    readonly docMeta: IDocMeta;

    /**
     * True if the user has permission to mutate this document.
     */
    readonly mutable: boolean;

}

export interface IDocMetaContext extends IDocMetaContextBase {
    readonly setDoc: (doc: IDocMetaContextBase) => void;
}

export const DocMetaContext = React.createContext<IDocMetaContext>(null!);

export function useDocMetaContext() {
    return useContext(DocMetaContext);
}

interface IProps {
    readonly docMeta: IDocMeta;
    readonly mutable: boolean
    readonly children: JSX.Element;
}

export const DocMetaContextProvider = React.memo((props: IProps) => {

    const [doc, setDoc] = useState<IDocMetaContextBase>({
        docMeta: props.docMeta,
        mutable: props.mutable
    });

    return (
        <DocMetaContext.Provider value={{...doc, setDoc}}>
            {props.children}
        </DocMetaContext.Provider>
    );

}, isEqual);
