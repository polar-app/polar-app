import {PersistenceLayerType} from '../datastore/PersistenceLayerManager';
import {ISODateTimeString,} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {MachineID, MachineIDs} from "polar-shared/src/util/MachineIDs";
import {IDocumentSnapshot} from "polar-firestore-like/src/IDocumentSnapshot";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

/**
 * Computes and stores stats for each machine's datastore.
 */
export class MachineDatastores {

    private static COLLECTION_NAME = "machine_datastore";

    public static async ref() {

        const firestore = await FirestoreBrowserClient.getInstance();

        const id = MachineIDs.get();

        const ref = firestore
            .collection(this.COLLECTION_NAME)
            .doc(id);

        return ref;

    }

    public static async get() {

        const ref = await this.ref();
        const snapshot = await ref.get();
        return this.toDoc(snapshot);

    }

    private static toDoc(snapshot: IDocumentSnapshot<any>) {

        if (! snapshot.exists) {
            return;
        }

        return <MachineDatastore> snapshot.data();

    }

    /**
     * Callback for when we have new data for the account.
     */
    public static async onSnapshot(onNext: (machineDatastore: MachineDatastore) => void) {

        const ref = await this.ref();

        return ref.onSnapshot(snapshot => {

            const doc = this.toDoc(snapshot);

            if (! doc) {
                return;
            }

            onNext(doc);

        }, ERR_HANDLER);

    }
}

export interface MachineDatastore {

    readonly persistenceLayerType?: PersistenceLayerType;

    readonly machine: MachineID;

    readonly nrDocs: number;

    readonly nrCaptures: number;

    readonly storageInBytes: number;

    readonly written: ISODateTimeString;

    // readonly datastoreCreated: ISODateTimeString;

}

const ERR_HANDLER = (err: Error) => console.error("Could not create snapshot for account: ", err);

