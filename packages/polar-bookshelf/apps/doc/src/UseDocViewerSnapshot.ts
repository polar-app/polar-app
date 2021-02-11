import * as React from "react";
import { IDStr } from "polar-shared/src/util/Strings";
import {useComponentDidMount} from "../../../web/js/hooks/ReactLifecycleHooks";
import {usePersistenceLayerContext} from "../../repository/js/persistence_layer/PersistenceLayerApp";
import {useLogger} from "../../../web/js/mui/MUILogger";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {useDocRepoStoreReducer} from "../../repository/js/doc_repo/DocRepoStore2";
import { Arrays } from "polar-shared/src/util/Arrays";
import {RepoDocInfo} from "../../repository/js/RepoDocInfo";

export type DocViewerSnapshotType = 'snapshot-local' | 'snapshot-server';

interface DocViewerSnapshot {
    readonly exists: boolean;
    readonly docMeta: IDocMeta | undefined;
    readonly hasPendingWrites: boolean;
    readonly type: DocViewerSnapshotType;
}

export function useDocViewerSnapshot2(docID: IDStr | undefined): DocViewerSnapshot | undefined {

    const persistenceLayerContext = usePersistenceLayerContext();
    const log = useLogger();

    const [snapshot, setSnapshot] = React.useState<DocViewerSnapshot | undefined>(undefined);

    useComponentDidMount(() => {

        const handleLoad = async () => {

            if (docID === undefined) {
                return;
            }

            const persistenceLayer
                = persistenceLayerContext.persistenceLayerProvider();

            // TODO: we are not unsubscribing the snapshot listener
            const snapshotResult = await persistenceLayer.getDocMetaSnapshot({
                fingerprint: docID,
                onSnapshot: (snapshot => {

                    function computeType() {
                        return snapshot.hasPendingWrites ? 'snapshot-local' : 'snapshot-server';
                    }

                    const type = computeType();

                    setSnapshot({
                        exists: snapshot.exists,
                        docMeta: snapshot.data,
                        hasPendingWrites: snapshot.hasPendingWrites,
                        type
                    })

                }),

                onError: (err) => {
                    log.error("Could not handle snapshot: ", err);
                }

            });

        };

        handleLoad()
            .catch(err => log.error(err));

    });

    return snapshot;

}

// function useDocMeta(docID: string | undefined): IDocMeta | undefined {
//
//     const [, setDocMeta, docMetaRef] = useStateRef<IDocMeta | undefined>(undefined);
//
//     const filter = React.useCallback((docMeta: IDocMeta | undefined): boolean => {
//         return docMetaRef.current !== docMeta;
//     }, [docMetaRef]);
//
//     return useDocRepoStoreReducer(store => Arrays.first(store.data.filter(current => current.docMeta.docInfo.fingerprint === docID)
//                                                                   .map(current => current.docMeta)), {filter});
//
// }

function useRepoDocInfo(docID: string | undefined): RepoDocInfo | undefined {

    function reducer(store: {data: ReadonlyArray<RepoDocInfo>}) {
        return Arrays.first(store.data.filter(current => current.docMeta.docInfo.fingerprint === docID))
    }

    return useDocRepoStoreReducer(reducer);

}


export function useDocViewerSnapshot(docID: IDStr | undefined): DocViewerSnapshot | undefined {

    const repoDocInfo = useRepoDocInfo(docID);

    const [snapshot, setSnapshot] = React.useState<DocViewerSnapshot | undefined>(undefined);

    React.useEffect(() => {

        function computeType() {
            return repoDocInfo?.hasPendingWrites ? 'snapshot-local' : 'snapshot-server';
        }

        const type = computeType();

        if (snapshot?.docMeta !== repoDocInfo?.docMeta) {

            if (repoDocInfo?.docMeta) {

                setSnapshot({
                    exists: true,
                    type,
                    docMeta: repoDocInfo.docMeta,
                    hasPendingWrites: repoDocInfo.hasPendingWrites,
                });

            } else {

                setSnapshot({
                    exists: false,
                    type,
                    docMeta: undefined,
                    hasPendingWrites: !!repoDocInfo?.hasPendingWrites
                });

            }

        }

    }, [docID, repoDocInfo, snapshot]);

    return snapshot;

}
