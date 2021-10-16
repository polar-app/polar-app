import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {UserIDStr} from "../Collections";
import {IQuerySnapshot} from "polar-firestore-like/src/IQuerySnapshot";
import {
    FIRESTORE_NULL_SNAPSHOT_SUBSCRIBER,
    FirestoreSnapshotSubscriber
} from "polar-firestore-like/src/FirestoreSnapshots";

/**
 * Keeps track of migrations.  Each user has a set of migrations which they can
 * read in eh client including their progress.
 */
export namespace MigrationCollection {

    export const COLLECTION_NAME = 'migration';

    export type MigrationStatus = 'started' | 'completed' | 'failed';

    export interface IMigrationBase<S extends MigrationStatus> {

        readonly id: string;

        readonly uid: string;

        /**
         * The name of the migration that the user has just performed.
         */
        readonly name: string;

        readonly status: S;

        readonly started: ISODateTimeString;

        readonly written: ISODateTimeString;

    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface IMigrationStarted extends IMigrationBase<'started'> {

    }

    export interface IMigrationCompleted extends IMigrationBase<'completed'> {
        readonly completed: ISODateTimeString;
    }

    export interface IMigrationFailed extends IMigrationBase<'failed'> {
        readonly failed: ISODateTimeString;
    }


    export type IMigration = IMigrationStarted | IMigrationCompleted | IMigrationFailed;

    export async function write<SM = undefined>(firestore: IFirestore<SM>, write: Exclude<IMigration, 'id' | 'written'>) {

        const id = Hashcodes.createID({
            uid: write.uid,
            name: write.name
        });

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(id);

        const value: IMigration = {
            ...write,
            id,
            written: ISODateTimeStrings.create(),
        }

        await ref.set(value);

    }

    export function createSnapshot<SM = undefined>(firestore: IFirestore<SM>,
                                                   uid: UserIDStr | undefined): FirestoreSnapshotSubscriber<IQuerySnapshot<SM>> {

        if (! uid) {
            return FIRESTORE_NULL_SNAPSHOT_SUBSCRIBER;
        }

        return (onNext, onError) => {
            return firestore.collection(COLLECTION_NAME)
                .where('uid', '==', uid)
                .onSnapshot(onNext, onError);
        }

    }

    export function createSnapshotByName<SM = undefined>(firestore: IFirestore<SM>,
                                                        uid: UserIDStr | undefined,
                                                        name: string): FirestoreSnapshotSubscriber<IQuerySnapshot<SM>> {

        if (! uid) {
            return FIRESTORE_NULL_SNAPSHOT_SUBSCRIBER;
        }

        return (onNext, onError) => {
            return firestore.collection(COLLECTION_NAME)
                .where('uid', '==', uid)
                .where('name', '==', name)
                .onSnapshot(onNext, onError);
        }

    }

}
