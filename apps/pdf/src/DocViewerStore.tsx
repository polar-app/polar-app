import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {
    createObservableStore,
    SetStore
} from "../../../web/spectron0/material-ui/store/ObservableStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {URLStr} from "polar-shared/src/util/Strings";
import {DocMetaFileRefs} from "../../../web/js/datastore/DocMetaRef";
import {Backend} from 'polar-shared/src/datastore/Backend';
import {usePersistenceLayerContext} from "../../repository/js/persistence_layer/PersistenceLayerApp";
import {useAnnotationSidebarCallbacks} from './AnnotationSidebarStore';
import {useDocMetaContext} from "../../../web/js/annotation_sidebar/DocMetaContextProvider";
import {
    AnnotationMutationCallbacks,
    AnnotationMutationsContextProvider,
    IAnnotationMutationCallbacks
} from "../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export interface IDocViewerStore {

    /**
     * The DocMeta currently being managed.
     */
    readonly docMeta?: IDocMeta;

    /**
     * The storage URL for the document this docMeta references.
     */
    readonly docURL?: URLStr;

}

export interface IDocViewerCallbacks {

    readonly setDocMeta: (docMeta: IDocMeta) => void;
    readonly annotationMutations: IAnnotationMutationCallbacks;

    // FIXME: where do we put the callback for injecting content from the
    // annotation control into the main doc.

}

const initialStore: IDocViewerStore = {
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IDocViewerStore>,
                        setStore: SetStore<IDocViewerStore>): Mutator {

    function reduce(): IDocViewerStore | undefined {
        return undefined;
    }

    return {};

}

type IDocMetaProvider = () => IDocMeta | undefined;

function callbacksFactory(storeProvider: Provider<IDocViewerStore>,
                          setStore: (store: IDocViewerStore) => void,
                          mutator: Mutator): IDocViewerCallbacks {

    const docMetaContext = useDocMetaContext();
    const persistenceLayerContext = usePersistenceLayerContext();
    const annotationSidebarCallbacks = useAnnotationSidebarCallbacks();

    const docMetaProvider = React.useMemo<IDocMetaProvider>(() => {

        return () => {
            const store = storeProvider();
            return store.docMeta;
        }

    }, []);

    function setDocMeta(docMeta: IDocMeta) {

        function doExec() {
            const store = storeProvider();

            const computeDocURL = (): URLStr | undefined => {

                if (docMeta) {

                    const docMetaFileRef = DocMetaFileRefs.createFromDocMeta(docMeta);
                    const persistenceLayer = persistenceLayerContext.persistenceLayerProvider();

                    if (docMetaFileRef.docFile) {
                        const file = persistenceLayer.getFile(Backend.STASH, docMetaFileRef.docFile);
                        return file.url;
                    }

                }

                return undefined;

            };

            const docURL = store.docURL || computeDocURL();

            setStore({...store, docMeta, docURL});

        }

        // update the main store.
        doExec();

        docMetaContext.setDoc({docMeta, mutable: true});

        // update the annotation sidebar
        annotationSidebarCallbacks.setDocMeta(docMeta);

    }

    const annotationMutations = AnnotationMutationCallbacks.create(updateStore, NULL_FUNCTION);

    function updateStore(docMetas: ReadonlyArray<IDocMeta>) {
        // this is almost always just ONE item at a time so any type of
        // bulk performance updates are pointless
        docMetas.map(setDocMeta);
    }

    return {
        setDocMeta,
        annotationMutations
    };

}

export const [DocViewerStoreProviderDelegate, useDocViewerStore, useDocViewerCallbacks, useDocViewerMutator]
    = createObservableStore<IDocViewerStore, Mutator, IDocViewerCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

interface IProps {
    readonly children: React.ReactElement;
}

const DocViewerStoreInner = React.memo((props: IProps) => {

    const docViewerCallbacks = useDocViewerCallbacks();

    return (
        <AnnotationMutationsContextProvider value={docViewerCallbacks.annotationMutations}>
            {props.children}
        </AnnotationMutationsContextProvider>
    );
});


export const DocViewerStore = React.memo((props: IProps) => {
    return (
        <DocViewerStoreProviderDelegate>
            <DocViewerStoreInner>
                {props.children}
            </DocViewerStoreInner>
        </DocViewerStoreProviderDelegate>
    );
});



