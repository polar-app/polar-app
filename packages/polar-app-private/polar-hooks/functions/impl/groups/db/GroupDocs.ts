import {DocumentReference, WriteBatch} from "@google-cloud/firestore";
import {ProfileIDStr} from './Profiles';
import {GroupMemberInvitationIDStr} from './GroupMemberInvitations';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Firestore} from '../../util/Firestore';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {IDUser} from '../../util/IDUsers';
import {GroupIDStr} from './Groups';
import {Collections} from './Collections';
import {Clause} from './Collections';
import {DocIDStr} from 'polar-shared/src/groups/DocRef';
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {ISODateTimeStrings, ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Preconditions} from "polar-shared/src/Preconditions";

export class GroupDocs {

    public static readonly COLLECTION = 'group_doc';

    /**
     * Create a deterministic key based on uid and groupID so that we don't have
     * to use an index to determine if we have a group invitation.
     */
    public static createID(docID: DocIDStr, profileID: ProfileIDStr, groupID: GroupIDStr) {
        return Hashcodes.createID({docID, profileID, groupID}, 20);
    }

    public static doc(docID: DocIDStr, profileID: ProfileIDStr, groupID: GroupIDStr): [GroupMemberInvitationIDStr, DocumentReference] {
        const firestore = Firestore.getInstance();
        const id = this.createID(docID, profileID, groupID);
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async deleteByGroupID(batch: WriteBatch, groupID: GroupIDStr) {
        await Collections.deleteByID(batch, this.COLLECTION, () => this.listByGroupID(groupID));
    }

    public static async listByGroupIDAndProfileID(groupID: GroupIDStr, profileID: ProfileIDStr): Promise<ReadonlyArray<GroupDoc>> {

        Preconditions.assertPresent(groupID, 'groupID');
        Preconditions.assertPresent(profileID, 'profileID');

        const clauses: ReadonlyArray<Clause> = [
            ['groupID', '==', groupID],
            ['profileID', '==', profileID]
        ];

        return await Collections.list(this.COLLECTION, clauses);

    }

    /**
     * Used so that we can find out which documents have been shared with which
     * groups for a given profileID
     */
    public static async listByDocIDAndProfileID(docID: DocIDStr, profileID: ProfileIDStr): Promise<ReadonlyArray<GroupDoc>> {

        Preconditions.assertPresent(docID, 'docID');
        Preconditions.assertPresent(profileID, 'profileID');

        const clauses: ReadonlyArray<Clause> = [
            ['docID', '==', docID],
            ['profileID', '==', profileID]
        ];

        return await Collections.list(this.COLLECTION, clauses);

    }

    public static async listByGroupID(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDoc>> {
        Preconditions.assertPresent(groupID, 'groupID');

        return await Collections.listByFieldValue(this.COLLECTION, 'groupID', groupID);
    }

    public static async set(batch: WriteBatch,
                            idUser: IDUser,
                            groupID: GroupIDStr,
                            docRef: DocRef) {

        const profileID = idUser.profileID;

        const [id, ref] = this.doc(docRef.docID, profileID, groupID);
        const created = ISODateTimeStrings.create();

        const groupDoc: GroupDoc = {
            ...docRef,
            id,
            created,
            profileID,
            groupID,
        };

        batch.set(ref, Dictionaries.onlyDefinedProperties(groupDoc));

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
