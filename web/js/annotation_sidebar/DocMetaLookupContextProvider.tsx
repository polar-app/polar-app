import {IDStr} from "polar-shared/src/util/Strings";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import React, {useContext} from "react";

export interface IDocMetaLookupContext {

    /**
     * Lookup the DocMeta by id/fingerprint
     */
    readonly lookup: (id: IDStr) => IDocMeta | undefined;

}

const defaultValue: IDocMetaLookupContext = {
    lookup: () => {
        console.warn("Using default lookup which always returns undefined");
        return undefined;
    }
};

export const DocMetaLookupContext = React.createContext<IDocMetaLookupContext>(defaultValue);

export function useDocMetaLookupContext() {
    return useContext(DocMetaLookupContext);
}
