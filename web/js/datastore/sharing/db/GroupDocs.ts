import {Firestore} from '../../../firebase/Firestore';
import {ProfileIDStr} from './Profiles';
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {ISODateTimeString} from '../../../metadata/ISODateTimeStrings';
import {GroupIDStr} from '../../Datastore';

export class GroupDocs {

    public static readonly COLLECTION = 'group_doc';

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDoc>> {

        const firestore = await Firestore.getInstance();

        const query = firestore
            .collection(this.COLLECTION)
            .where('groupID', '==', groupID);

        const snapshot = await query.get();

        return snapshot.docs.map(current => <GroupDoc> current.data());

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
