import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";

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

    export async function write<SM>(firestore: IFirestore<SM>, write: Exclude<IMigration, 'id' | 'written'>) {

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

}
