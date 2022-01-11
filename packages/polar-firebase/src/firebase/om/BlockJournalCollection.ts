import {TDocumentData} from "polar-firestore-like/src/TDocumentData";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";


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

    readonly timestamp: ISODateTimeString;

    readonly before: TDocumentData | undefined;

    readonly after: TDocumentData | undefined;

}

export namespace BlockJournalCollection {

    export const COLLECTION = 'block_journal';

    export async function set(firestore: IFirestore<unknown>, blockJournal: IBlockJournal) {
        return await Collections.set(firestore, COLLECTION, blockJournal.id, blockJournal);
    }

}
