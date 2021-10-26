import {DocRef} from 'polar-shared/src/groups/DocRef';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Collections} from "polar-firestore-like/src/Collections";
import {ProfileIDStr, GroupIDStr} from "polar-shared/src/util/Strings";
import Clause = Collections.Clause;
import SnapshotListener = Collections.SnapshotListener;
import DocumentChange = Collections.DocumentChangeValue;
import OrderByClause = Collections.OrderByClause;
import {IFirestore} from "polar-firestore-like/src/IFirestore";

export class GroupDocCollection {

    public static readonly COLLECTION = 'group_doc';


    public static async list<SM>(firestore: IFirestore<SM>, groupID: GroupIDStr): Promise<ReadonlyArray<GroupDoc>> {

        return await Collections.list(firestore, this.COLLECTION, [['groupID', '==', groupID]]);
    }

    public static async getByFingerprint<SM>(firestore: IFirestore<SM>, groupID: GroupIDStr,
                                         fingerprint: string,
                                         limit: number = 1): Promise<ReadonlyArray<GroupDoc>> {

        const clauses: ReadonlyArray<Clause> = [
            ['groupID', '==', groupID],
            ['fingerprint', '==', fingerprint]
        ];

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['created', 'desc']
        ];

        return await Collections.list(firestore, this.COLLECTION, clauses, {orderBy, limit});

    }

    public static async onSnapshot<SM = unknown>(firestore: IFirestore<SM>, groupID: GroupIDStr, handler: SnapshotListener<DocumentChange<SM>>) {

        return Collections.onQuerySnapshotChanges<SM>(firestore, this.COLLECTION, [['groupID', '==', groupID]], handler);
    }

    public static async onSnapshotForByGroupIDAndFingerprint<SM = unknown>(firestore: IFirestore<SM>, groupID: GroupIDStr,
                                                             fingerprint: string,
                                                             handler: SnapshotListener<DocumentChange<SM>> ) {

        const clauses: readonly Clause[] = [
            ['groupID', '==', groupID],
            ['fingerprint', '==', fingerprint],
        ];

        return Collections.onQuerySnapshotChanges<SM>(firestore, this.COLLECTION, clauses, handler);

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
