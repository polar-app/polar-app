import {IDStr} from "polar-shared/src/util/Strings";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import React, {useContext} from "react";
import {
    IAnnotationRef,
    IAnnotationRefWithDocMeta
} from "polar-shared/src/metadata/AnnotationRefs";

export interface IDocMetaLookupContext {

    /**
     * Lookup the DocMeta by id/fingerprint
     */
    readonly lookup: (id: IDStr) => IDocMeta | undefined;

    readonly lookupAnnotations: (annotations: ReadonlyArray<IAnnotationRef>) => ReadonlyArray<IAnnotationRefWithDocMeta>;

}

export abstract class BaseDocMetaLookupContext implements IDocMetaLookupContext {

    public abstract lookup(id: IDStr): IDocMeta | undefined ;

    public lookupAnnotations(annotations: ReadonlyArray<IAnnotationRef>): ReadonlyArray<IAnnotationRefWithDocMeta> {

        const toDocMetaAnnotationMutationRef = (annotation: IAnnotationRef): IAnnotationRefWithDocMeta => {

            const docMeta = this.lookup(annotation.docMetaRef.id);

            if (! docMeta) {
                throw new Error("Could not resolve docMeta ID: " + annotation.docMetaRef.id);
            }

            return {
                id: annotation.id,
                pageNum: annotation.pageNum,
                annotationType: annotation.annotationType,
                docMetaRef: annotation.docMetaRef,
                original: annotation.original,
                docMeta
            }


        }

        return annotations.map(toDocMetaAnnotationMutationRef);

    }

}

class NullDocMetaLookupContext extends BaseDocMetaLookupContext {

    public lookup() {
        console.warn("Using default lookup which always returns undefined");
        return undefined;
    }

}

const defaultValue = new NullDocMetaLookupContext();

export const DocMetaLookupContext = React.createContext<IDocMetaLookupContext>(defaultValue);

export function useDocMetaLookupContext() {
    return useContext(DocMetaLookupContext);
}
