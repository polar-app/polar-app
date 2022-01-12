import * as functions from 'firebase-functions';
import {IBlock} from 'polar-blocks/src/blocks/IBlock';
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {
    BlockJournalCollection,
    BlockWriteOperation,
    IBlockJournal
} from "polar-firebase/src/firebase/om/BlockJournalCollection";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

/**
 * This listens to block modifications, then writes them to a journal.
 */
export const BlockWriteTriggerFunction
    = functions.firestore.document('/block/{document=**}')
        .onWrite(async (change, context) => {

    const firestore = FirestoreAdmin.getInstance();

    const dataBefore = change.before.data() as IBlock | undefined;
    const dataAfter  = change.after.data() as IBlock | undefined;

    const id = (dataBefore?.id || dataAfter?.id)!;

    const timestamp = ISODateTimeStrings.create();

    function computeType(): BlockWriteOperation | undefined {

        if (dataBefore === undefined && dataAfter !== undefined) {
            return 'added'
        }

        if (dataBefore !== undefined && dataAfter !== undefined) {
            return 'modified'
        }

        if (dataBefore !== undefined && dataAfter === undefined) {
            return 'removed'
        }

        // should never happen
        return undefined;

    }

    const type = computeType();

    if (type) {

        const blockJournal: IBlockJournal = {
            id,
            type,
            timestamp,
            before: dataBefore,
            after: dataAfter
        }

        await BlockJournalCollection.set(firestore, Dictionaries.onlyDefinedProperties(blockJournal));

    } else {
        console.error("Unable to determine write type: ", dataBefore, dataAfter);
    }


});

