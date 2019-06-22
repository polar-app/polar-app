import {DocRef} from 'polar-shared/src/groups/DocRef';
import {PersistenceLayer, WriteOpts} from '../PersistenceLayer';
import {BackendFileRef} from '../Datastore';
import {DocMetas} from '../../metadata/DocMetas';
import {DatastoreImportFiles} from './rpc/DatastoreImportFiles';
import {DocIDStr} from './rpc/GroupProvisions';
import {Firestore} from '../../firebase/Firestore';
import {RecordHolder} from '../FirebaseDatastore';
import {DatastoreCollection} from '../FirebaseDatastore';
import {BackendFileRefs} from '../BackendFileRefs';
import {DocInfo} from '../../metadata/DocInfo';
import {Either} from '../../util/Either';
import {DocRefs} from './db/DocRefs';
import {FirebaseDatastores} from '../FirebaseDatastores';
import {GroupIDStr} from '../Datastore';

export class GroupDatastores {

    public static async importFromGroup(persistenceLayer: PersistenceLayer,
                                        groupDocRef: GroupDocRef) {

        const {groupID, docRef} = groupDocRef;
        const {docID} = docRef;

        async function getDocInfoRecord(docID: DocIDStr) {

            const firestore = await Firestore.getInstance();

            const ref = firestore
                .collection(DatastoreCollection.DOC_INFO)
                .doc(docID);

            const snapshot = await ref.get();

            return <RecordHolder<DocInfo> | undefined> snapshot.data();

        }

        async function getDocInfo(docID: DocIDStr) {

            const docInfoRecord = await getDocInfoRecord(docID);

            if (! docInfoRecord) {
                throw new Error("Unable to import. No docInfo");
            }

            return docInfoRecord.value;

        }

        const docInfo = await getDocInfo(docID);

        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo));

        if (! backendFileRef) {
            throw new Error("No backend file ref");
        }

        // this will perform an efficient copy of the data on the backend.
        await DatastoreImportFiles.exec({
            docID,
            backend: backendFileRef.backend,
            fileRef: backendFileRef
        });

        function createDocMeta(backendFileRef: BackendFileRef) {

            const docMeta = DocMetas.create(docRef.fingerprint, docRef.nrPages);

            DocRefs.toDocInfo(docRef, docMeta.docInfo);

            docMeta.docInfo.filename = backendFileRef.name;
            docMeta.docInfo.backend = backendFileRef.backend;
            docMeta.docInfo.hashcode = backendFileRef.hashcode;

            return docMeta;

        }

        const docMeta = createDocMeta(backendFileRef);

        async function writeDocMeta() {

            const docInfo = docMeta.docInfo;
            const {fingerprint} = docInfo;

            /**
             * Compute the groups field for the record.
             */
            async function computeGroups(): Promise<ReadonlyArray<GroupIDStr>> {

                // We have to read the previous groups and then merge it with
                // the new groups if they exist.

                const docID = FirebaseDatastores.computeDocMetaID(fingerprint);

                const docInfoRecord = await getDocInfoRecord(docID);

                if (docInfoRecord && docInfoRecord.groups) {
                    return [groupID, ...docInfoRecord.groups];
                }

                return [groupID];

            }

            const groups = await computeGroups();

            // FIXME: just read the current gruops + visibility and then
            // write out the new groups + visibility if it they exist...

            const writeOpts: WriteOpts = {
                groups
            };

            await persistenceLayer.write(fingerprint, docMeta, writeOpts);
            return docInfo;

        }

        // FIXME: make sure the docs and visibility are setup properly.

        // FIXME: the groups and visibility of this document need to be set
        // properly and ideally we wouldn't have to perform two writes.

        await writeDocMeta();

    }

}

export interface GroupDocRef {
    readonly groupID: GroupIDStr;
    readonly docRef: DocRef;
}
