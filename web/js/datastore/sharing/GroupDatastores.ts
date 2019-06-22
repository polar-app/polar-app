import {DocRef} from 'polar-shared/src/groups/DocRef';
import {PersistenceLayer} from '../PersistenceLayer';
import {Datastore} from '../Datastore';
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

export class GroupDatastores {

    public static async importFromGroup(datastore: Datastore | PersistenceLayer, docRef: DocRef) {

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

        await datastore.writeDocMeta(docMeta);

    }

}
