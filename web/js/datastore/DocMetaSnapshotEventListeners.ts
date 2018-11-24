import {DocMetaMutation, DocMetaSnapshotEvent, DocMetaSnapshotEventListener} from './Datastore';
import {DocMetaComparisonIndex} from './DocMetaComparisonIndex';

export class DocMetaSnapshotEventListeners {

    /**
     * Create a new listener that takes inputs and creates a de-duplicated listener
     * that only emits new or updated documents by the UUID or deleted documents.
     */
    public static createDeduplicatedListener(output: DocMetaSnapshotEventListener) {

        const docMetaComparisonIndex = new DocMetaComparisonIndex();

        return (docMetaSnapshotEvent: DocMetaSnapshotEvent) => {

            const filteredDocMetaMutations: DocMetaMutation[] = [];

            for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {

                const docInfo = docMetaMutation.docInfoProvider();

                if (docMetaMutation.mutationType === 'created' && ! docMetaComparisonIndex.get(docInfo.fingerprint)) {
                    // when the doc is created and it's not in the index.
                    docMetaComparisonIndex.putDocInfo(docInfo);
                    filteredDocMetaMutations.push(docMetaMutation);
                }

                if (docMetaMutation.mutationType === 'deleted' && docMetaComparisonIndex.get(docInfo.fingerprint)) {
                    // if we're deleting the document and we've seen it before and it's in the index.
                    docMetaComparisonIndex.remove(docInfo.fingerprint);
                    filteredDocMetaMutations.push(docMetaMutation);
                }

                //     const docComparison =
                // this.docComparisonIndex.get(docMeta.docInfo.fingerprint);  if (!
                // docComparison) { this.onRemoteDocMutation(docMeta, 'created'); }  if
                // (docComparison && UUIDs.compare(docComparison.uuid,
                // docMeta.docInfo.uuid) > 0) { this.onRemoteDocMutation(docMeta,
                // 'updated'); }  }


            }

            output({
                progress: docMetaSnapshotEvent.progress,
                docMetaMutations: filteredDocMetaMutations
           });

        };

    }

}
