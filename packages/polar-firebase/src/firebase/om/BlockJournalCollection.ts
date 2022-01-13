import {TDocumentData} from "polar-firestore-like/src/TDocumentData";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";
import {UserIDStr} from "polar-shared/src/util/Strings";

export type BlockWriteOperation = 'added' | 'modified' | 'removed';

/**
 * There are three paths here.
 *
 * after is defined and before is undefined => added
 * after is defined, and before is defined => modified
 * after us undefined, and before is defined => removed
 *
 */
export interface IBlockJournal {

    readonly id: string;

    /**
     * This is mostly just for human readability / debug purposes.
     */
    readonly type: BlockWriteOperation;

    readonly timestamp: ISODateTimeString;

    readonly before: TDocumentData | undefined;

    readonly after: TDocumentData | undefined;

}

export namespace BlockJournalCollection {

    export const COLLECTION = 'block_journal';

    export async function set(firestore: IFirestore<unknown>, blockJournal: IBlockJournal) {
        return await Collections.set(firestore, COLLECTION, blockJournal.id, blockJournal);
    }

    /**
     * TODO: this only fetches the users personal nspace.
     */
    export async function list(firestore: IFirestore<unknown>, uid: UserIDStr): Promise<ReadonlyArray<IBlockJournal>> {
        return await Collections.list(firestore, COLLECTION, [['nspace', '==', uid ]]);
    }

}
