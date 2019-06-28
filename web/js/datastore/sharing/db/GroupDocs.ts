import {ProfileIDStr} from './Profiles';
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {ISODateTimeString} from '../../../metadata/ISODateTimeStrings';
import {GroupIDStr} from '../../Datastore';
import {Collections} from './Collections';
import {Clause} from './Collections';
import {SnapshotListener} from './Collections';

export class GroupDocs {

    public static readonly COLLECTION = 'group_doc';

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDoc>> {
        return await Collections.list(this.COLLECTION, [['groupID', '==', groupID]]);
    }

    public static async onSnapshot(groupID: GroupIDStr, handler: SnapshotListener<GroupDoc>) {
        return await Collections.onSnapshot(this.COLLECTION, [['groupID', '==', groupID]], handler);
    }

    public static async onSnapshotForByGroupIDAndFingerprint(groupID: GroupIDStr,
                                                             fingerprint: string,
                                                             handler: SnapshotListener<GroupDoc> ) {

        const clauses: Clause[] = [
            ['groupID', '==', groupID],
            ['fingerprint', '==', fingerprint],
        ];

        return await Collections.onSnapshot(this.COLLECTION, clauses, handler);

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
