import * as functions from 'firebase-functions';
import {IBlock} from 'polar-blocks/src/blocks/IBlock';
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {BlockJournalCollection, IBlockJournal} from "polar-firebase/src/firebase/om/BlockJournalCollection";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

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

    const blockJournal: IBlockJournal = {
        id,
        timestamp,
        before: dataBefore,
        after: dataAfter
    }

    await BlockJournalCollection.set(firestore, blockJournal);

});

