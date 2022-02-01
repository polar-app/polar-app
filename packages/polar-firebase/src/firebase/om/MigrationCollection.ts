import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {IQuerySnapshot} from "polar-firestore-like/src/IQuerySnapshot";
import {
    FIRESTORE_NULL_SNAPSHOT_SUBSCRIBER,
    FirestoreSnapshotSubscriber
} from "polar-firestore-like/src/FirestoreSnapshots";
import {IFirestoreError} from "polar-firestore-like/src/IFirestoreError";

/**
 * Keeps track of migrations.  Each user has a set of migrations which they can
 * read in eh client including their progress.
 */
export namespace MigrationCollection {

    export const COLLECTION_NAME = 'migration';

    export type MigrationStatus = 'started' | 'completed' | 'failed';

    export type MigrationIDStr = 'block-usertagsdb' | 'block-usertagsdb3' | 'block-annotations';

    export interface IMigrationBase<S extends MigrationStatus> {

        readonly id: string;

        readonly uid: string;

        /**
         * The name of the migration that the user has just performed.
         */
        readonly name: MigrationIDStr;

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

    interface ICreateIDOpts {
        readonly uid: UserIDStr,
        readonly name: IDStr;
    }


    export function createID(opts: ICreateIDOpts) {
        return Hashcodes.createID({
            uid: opts.uid,
            name: opts.name
        })
    }

    export async function getByName<SM = unknown>(firestore: IFirestore<SM>,
                                                  uid: UserIDStr | undefined,
                                                  name: MigrationIDStr) {

        return firestore.collection(COLLECTION_NAME)
                        .where('uid', '==', uid)
                        .where('name', '==', name)
                        .get();

    }

    export async function createByName<SM = unknown>(firestore: IFirestore<SM>,
                                                     uid: UserIDStr,
                                                     name: MigrationIDStr): Promise<IMigrationStarted | undefined> {

        try {

            const id = createID({uid, name});

            const migration: IMigrationStarted = {
                id, uid, name,
                status: 'started',
                started: ISODateTimeStrings.create(),
                written: ISODateTimeStrings.create()
            }

            await firestore.collection(COLLECTION_NAME)
                .doc(id)
                .create(migration);

            return migration;

        } catch (e) {

            if ((e as IFirestoreError).code === 'already-exists') {
                // we just didn't win the lock
                return undefined;
            }

            throw e;

        }

    }

    type IWriteData = Omit<IMigrationCompleted, 'id' | 'written'>
                     | Omit<IMigrationStarted, 'id' | 'written'>
                     | Omit<IMigrationFailed, 'id' | 'written'>;


    export async function write<SM = undefined>(firestore: IFirestore<SM>,
                                                write: IWriteData) {

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
                                                         name: MigrationIDStr): FirestoreSnapshotSubscriber<IQuerySnapshot<SM>> {

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

    export async function createMigrationForBlockAnnotations<SM = undefined>(firestore: IFirestore<SM>, uid: UserIDStr) {
        await MigrationCollection.createByName(firestore, uid, 'block-annotations')
    }

}
