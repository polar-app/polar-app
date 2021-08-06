import {DocRef} from 'polar-shared/src/groups/DocRef';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {GroupIDStr} from '../../Datastore';
import {Collections} from "polar-firestore-like/src/Collections";
import {ProfileIDStr} from "polar-firebase/src/firebase/om/ProfileCollection";

import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

import Clause = Collections.Clause;
import SnapshotListener = Collections.SnapshotListener;
import DocumentChange = Collections.DocumentChange;
import OrderByClause = Collections.OrderByClause;



export class GroupDocCollection {

    public static readonly COLLECTION = 'group_doc';


    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDoc>> {
        const firestore = await FirestoreBrowserClient.getInstance();

        return await Collections.list(firestore, this.COLLECTION, [['groupID', '==', groupID]]);
    }

    public static async getByFingerprint(groupID: GroupIDStr,
                                         fingerprint: string,
                                         limit: number = 1): Promise<ReadonlyArray<GroupDoc>> {

        const clauses: ReadonlyArray<Clause> = [
            ['groupID', '==', groupID],
            ['fingerprint', '==', fingerprint]
        ];

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['created', 'desc']
        ];

        const firestore = await FirestoreBrowserClient.getInstance();


        return await Collections.list(firestore, this.COLLECTION, clauses, {orderBy, limit});

    }

    public static async onSnapshot(groupID: GroupIDStr, handler: SnapshotListener<DocumentChange<GroupDoc>>) {
        const firestore = await FirestoreBrowserClient.getInstance();

        return await Collections.onQuerySnapshotChanges(firestore, this.COLLECTION, [['groupID', '==', groupID]], handler);
    }

    public static async onSnapshotForByGroupIDAndFingerprint(groupID: GroupIDStr,
                                                             fingerprint: string,
                                                             handler: SnapshotListener<DocumentChange<GroupDoc>> ) {

        const clauses: Clause[] = [
            ['groupID', '==', groupID],
            ['fingerprint', '==', fingerprint],
        ];
        const firestore = await FirestoreBrowserClient.getInstance();

        return await Collections.onQuerySnapshotChanges(firestore, this.COLLECTION, clauses, handler);

    }

}

export interface GroupDocInit extends DocRef {

    /**
     * The profile for the owner of this document.
     */
    readonly profileID: ProfileIDStr;

    /**
     * The group that this doc is associated with.
     */
    readonly groupID: GroupIDStr;

}

export interface GroupDoc extends GroupDocInit {

    /**
     * The ID for this doc
     */
    readonly id: GroupDocIDStr;

    /**
     * the time this document was added to the group.
     */
    readonly created: ISODateTimeString;

}

export type GroupDocIDStr = string;
