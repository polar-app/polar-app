import {DocMetaMutation, DocMetaSnapshotEvent, DocMetaSnapshotEventListener} from './Datastore';
import {DocMetaComparisonIndex} from './DocMetaComparisonIndex';
import {UUIDs} from '../metadata/UUIDs';

export class DocMetaSnapshotEventListeners {

    /**
     * Create a new listener that takes inputs and creates a de-duplicated
     * listener that only emits new or updated documents by the UUID or deleted
     * documents.
     */
    public static createDeduplicatedListener(output: DocMetaSnapshotEventListener) {

        const docMetaComparisonIndex = new DocMetaComparisonIndex();

        // FIXME: this should work with N listeners... so we can have the
        // EXISTING listener that sends from IPC as well the firebase listeners
        // and we will just get the earliest one... UI only needs the DocMeta
        // so we dont need to forward this on...

        // TODO: test this with the comparison too...

        // FIXME: should we filter on the consistency level?  We need a way to
        // trigger the first sync when we get the committed writes from the
        // FirebaseDatastore so if we get 'written' consistency level from Firebase
        // and the rest are filtered we can't ever trigger the synchronize ...

        // we could have custom filters for the level... so we could support
        // BOTH, committed, or written levels...

        // FIXME: when working with the synchronize() method of the PersistenceLayers
        // it might be nice to just commit locally then wait until it's committed
        // to firebase so that I can have two progress bars but this might not
        // be necessary.

        return (docMetaSnapshotEvent: DocMetaSnapshotEvent) => {

            const filteredDocMetaMutations: DocMetaMutation[] = [];

            for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {

                const docInfo = docMetaMutation.docInfoProvider();
                const mutationType = docMetaMutation.mutationType;

                let doUpdated = false;

                if (mutationType === 'created' && ! docMetaComparisonIndex.get(docInfo.fingerprint)) {
                    doUpdated = true;
                }

                if (mutationType === 'updated') {

                    const docComparison = docMetaComparisonIndex.get(docInfo.fingerprint);

                    if (!docComparison) {
                        doUpdated = true;
                    }

                    if (docComparison && UUIDs.compare(docComparison.uuid, docInfo.uuid) > 0) {
                        doUpdated = true;
                    }

                }

                if (doUpdated) {
                    // when the doc is created and it's not in the index.
                    docMetaComparisonIndex.putDocInfo(docInfo);
                    filteredDocMetaMutations.push(docMetaMutation);
                }

                if (mutationType === 'deleted' && docMetaComparisonIndex.get(docInfo.fingerprint)) {
                    // if we're deleting the document and we've seen it before
                    // and it's in the index.
                    docMetaComparisonIndex.remove(docInfo.fingerprint);
                    filteredDocMetaMutations.push(docMetaMutation);
                }

            }

            output({
                consistency: docMetaSnapshotEvent.consistency,
                progress: docMetaSnapshotEvent.progress,
                docMetaMutations: filteredDocMetaMutations
           });

        };

    }

}
