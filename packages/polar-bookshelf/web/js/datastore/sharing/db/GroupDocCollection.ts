import {DocRef} from 'polar-shared/src/groups/DocRef';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {GroupIDStr} from '../../Datastore';
// import {Collections, DocumentChange, OrderByClause} from './Collections';
// import {Clause} from './Collections';
// import {SnapshotListener} from './Collections';
import {Collections, Clause, SnapshotListener, DocumentChange, OrderByClause} from "polar-firestore-like/src/Collections";

import {ProfileIDStr} from "polar-firebase/src/firebase/om/ProfileCollection";

import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";


export class GroupDocCollection {

    public static readonly COLLECTION = 'group_doc';


    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDoc>> {
        return await Collections.list(await FirestoreBrowserClient.getInstance(), this.COLLECTION, [['groupID', '==', groupID]]);
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

        return await Collections.list(await FirestoreBrowserClient.getInstance(), this.COLLECTION, clauses, {orderBy, limit});

    }

    public static async onSnapshot(groupID: GroupIDStr, handler: SnapshotListener<DocumentChange<GroupDoc>>) {
        return await Collections.onQuerySnapshotChanges(this.COLLECTION, [['groupID', '==', groupID]], handler);
    }

    public static async onSnapshotForByGroupIDAndFingerprint(groupID: GroupIDStr,
                                                             fingerprint: string,
                                                             handler: SnapshotListener<DocumentChange<GroupDoc>> ) {

        const clauses: Clause[] = [
            ['groupID', '==', groupID],
            ['fingerprint', '==', fingerprint],
        ];

        return await Collections.onQuerySnapshotChanges(this.COLLECTION, clauses, handler);

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
