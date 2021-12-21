import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {RepoDocInfoDataObjectIndex} from "../../../../apps/repository/js/RepoDocMetaManager";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {FirebaseDatastores} from "polar-shared/src/datastore/FirebaseDatastores";
import {Tag} from "polar-shared/src/tags/Tags";
import {DocumentContent} from "../content/DocumentContent";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {UUIDs} from "polar-shared/src/metadata/UUIDs";
import {DocMetas} from "polar-shared/src/metadata/DocMetas";
import {IBlocksStoreMutation} from "../store/IBlocksStoreMutation";
import {IBlockPredicates} from "../store/IBlockPredicates";

export namespace DocumentDataUpdater {

    type IDocMutation = {
        readonly type: 'added' | 'removed' | 'modified',
        readonly block: IBlock<IDocumentContent>,
    };

    function getDocMutation(mutation: IBlocksStoreMutation): IDocMutation | null {
        const getBlock = () => {
            switch (mutation.type) {
                case 'added':
                    return mutation.added;
                case 'removed':
                    return mutation.removed;
                case 'modified':
                    return mutation.after;
            }
        };

        const block = getBlock();

        if (! IBlockPredicates.isDocumentBlock(block)) {
            return null;
        }


        return {
            type: mutation.type,
            block,
        };
    }

    export async function writeDocInfoUpdatesToBatch(firestore: IFirestore<unknown>,
                                                     repoDocInfoDataObjectIndex: RepoDocInfoDataObjectIndex,
                                                     batch: IWriteBatch<unknown>,
                                                     mutations: ReadonlyArray<IBlocksStoreMutation>) {

        const documentMutations = arrayStream(mutations).map(getDocMutation).filterPresent().collect();
        const docMetaCollection = firestore.collection('doc_meta');
        const docInfoCollection = firestore.collection('doc_info');

        for (const {type, block} of documentMutations) {
            const {fingerprint} = block.content.docInfo;
            const identifier = FirebaseDatastores.computeDocMetaID(fingerprint, block.uid)
            const docMetaDoc = docMetaCollection.doc(identifier);
            const docInfoDoc = docInfoCollection.doc(identifier);

            // Tags are stored in a different way in blocks so we need to sync them manually.
            const tags: Record<string, Tag> = arrayStream((new DocumentContent(block.content)).getTags())
                .map(({label}) => ({label, id: label}))
                .toMap(({label}) => label);

            const docInfo: IDocInfo = {
                ...block.content.docInfo,
                tags,
                lastUpdated: ISODateTimeStrings.create(),
                uuid: UUIDs.create(),
            };

            const repoDocInfo = repoDocInfoDataObjectIndex.get(fingerprint);

            if (! repoDocInfo) {
                // This technically should never happen.
                return console.log(`DocMeta record was not found for doc ID: ${fingerprint}. skipping update...`);
            }

            const docMeta = repoDocInfo.docMeta;

            const docMetaValue = DocMetas.serialize({...docMeta, docInfo});

            switch (type) {
                case 'added':
                case 'modified':
                    batch.update(docInfoDoc, 'value', docInfo);
                    batch.update(docMetaDoc, 'value.docInfo', docInfo);
                    batch.update(docMetaDoc, 'value.value', docMetaValue);
                    break;
                case 'removed':
                    // Deleting a document block doesn't necessarily mean that we want to also delete
                    // it from docMeta because the document might still be there.
                    break;
            }
        }
    }
}
