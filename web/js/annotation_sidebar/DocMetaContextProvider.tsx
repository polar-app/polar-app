import React, {useContext, useState} from 'react';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

interface IDocBase {

    readonly docMeta: IDocMeta;

    /**
     * True if the user has permission to mutate this document.
     */
    readonly mutable: boolean;

}

interface IDoc extends IDocBase {
    readonly setDoc: (doc: IDocBase) => void;
}

export const DocMetaContext = React.createContext<IDoc>(null!);

export function useDocMetaContext() {
    return useContext(DocMetaContext);
}

interface IProps {
    readonly docMeta: IDocMeta;
    readonly mutable: boolean
    readonly children: JSX.Element;
}

export const DocMetaContextProvider = React.memo((props: IProps) => {

    const [doc, setDoc] = useState<IDocBase>({
        docMeta: props.docMeta,
        mutable: props.mutable
    });

    return (
        <DocMetaContext.Provider value={{...doc, setDoc}}>
            {props.children}
        </DocMetaContext.Provider>
    );

});
