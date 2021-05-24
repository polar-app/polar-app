import {IDStr} from "polar-shared/src/util/Strings";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import React, {useContext} from "react";
import {
    IAnnotationRef,
    IAnnotationRefWithDocMeta
} from "polar-shared/src/metadata/AnnotationRefs";
import {
    IAnnotationMutationHolder,
    IAnnotationMutationHolderWithDocMeta
} from "./AnnotationMutationsContext";

export interface IDocMetaLookupContext {

    /**
     * Lookup the DocMeta by id/fingerprint
     */
    readonly lookup: (id: IDStr) => IDocMeta | undefined;

    readonly lookupAnnotations: (annotations: ReadonlyArray<IAnnotationRef>) => ReadonlyArray<IAnnotationRefWithDocMeta>;
    lookupAnnotationHolders<M>(annotations: ReadonlyArray<IAnnotationMutationHolder<M>>): ReadonlyArray<IAnnotationMutationHolderWithDocMeta<M>>;

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

    public lookupAnnotationHolders<M>(annotations: ReadonlyArray<IAnnotationMutationHolder<M>>): ReadonlyArray<IAnnotationMutationHolderWithDocMeta<M>> {

        const doLookup = (holder: IAnnotationMutationHolder<M>): IAnnotationMutationHolderWithDocMeta<M> => {

            const {annotation} = holder;

            const docMeta = this.lookup(annotation.docMetaRef.id);

            if (! docMeta) {
                throw new Error("Could not resolve docMeta ID: " + annotation.docMetaRef.id);
            }

            return {
                annotation: {...annotation, docMeta},
                mutation: holder.mutation
            };

        }

        return annotations.map(doLookup);

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
