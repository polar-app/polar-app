import {IDStr, UserIDStr, CollectionNameStr} from "polar-shared/src/util/Strings";
import {ISpacedRep, TaskRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Preconditions} from "polar-shared/src/Preconditions";
import {Collections} from "polar-firestore-like/src/Collections";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

import Clause = Collections.Clause;
import {FirestoreProvider} from "./DocPreviewCollection";
/**
 * Main class storing spaced repetition for flashcards, annotations, etc.  This stores the
 * state of the card so that next time we want to access it we can just fetch it
 * directly.
 */
export class SpacedRepCollection {

    public static firestoreProvider: FirestoreProvider;

    private static COLLECTION: CollectionNameStr = "spaced_rep";

    public static async set(id: IDStr, spacedRep: SpacedRep) {
        const firestore = await FirestoreBrowserClient.getInstance();
        Preconditions.assertPresent(id, 'id');

        await Collections.set(firestore, this.COLLECTION, id, spacedRep);
    }

    public static async get(id: IDStr): Promise<SpacedRep | undefined> {
        const firestore = await FirestoreBrowserClient.getInstance();
        Preconditions.assertPresent(id, 'id');

        return await Collections.get(firestore, this.COLLECTION, id);
    }

    public static async list(uid: UserIDStr): Promise<ReadonlyArray<SpacedRep>> {
        const firestore = await FirestoreBrowserClient.getInstance();
        Preconditions.assertPresent(uid, 'uid');
        const clauses: ReadonlyArray<Clause> = [['uid', '==', uid]];

        return await Collections.list(firestore, this.COLLECTION, clauses);
    }

    public static convertFromTaskRep(uid: UserIDStr, taskRep: TaskRep<any>): SpacedRep {

        return {
            uid,
            id: taskRep.id,
            suspended: taskRep.suspended,
            lapses: taskRep.lapses,
            stage: taskRep.stage,
            state: taskRep.state
        };

    }

}

/**
 * Represent the spaced repetition state for a card.
 */
export interface SpacedRep extends ISpacedRep {

    /**
     * The user ID / owner of this card.
     */
    readonly uid: UserIDStr;

}
