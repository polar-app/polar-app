import {GroupMemberInvitationIDStr} from './GroupMemberInvitations';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {IDUser} from '../../util/IDUsers';
import {GroupIDStr} from './Groups';
import {DocIDStr, DocRef} from 'polar-shared/src/groups/DocRef';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Preconditions} from "polar-shared/src/Preconditions";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {IDocumentReference} from "polar-firestore-like/src/IDocumentReference";
import {ProfileIDStr} from "polar-shared/src/util/Strings";
import {Collections} from "polar-firestore-like/src/Collections";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import Clause = Collections.Clause;

export class GroupDocs {

    public static readonly COLLECTION = 'group_doc';

    /**
     * Create a deterministic key based on uid and groupID so that we don't have
     * to use an index to determine if we have a group invitation.
     */
    public static createID(docID: DocIDStr, profileID: ProfileIDStr, groupID: GroupIDStr) {
        return Hashcodes.createID({docID, profileID, groupID}, 20);
    }

    public static doc(docID: DocIDStr, profileID: ProfileIDStr, groupID: GroupIDStr): [GroupMemberInvitationIDStr, IDocumentReference<unknown>] {
        const firestore = FirestoreAdmin.getInstance();
        const id = this.createID(docID, profileID, groupID);
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async deleteByGroupID(batch: IWriteBatch<unknown>, groupID: GroupIDStr) {
        const firestore = FirestoreAdmin.getInstance();
        await Collections.deleteByID(firestore, this.COLLECTION, batch, () => this.listByGroupID(groupID));
    }

    public static async listByGroupIDAndProfileID(groupID: GroupIDStr, profileID: ProfileIDStr): Promise<ReadonlyArray<GroupDoc>> {

        Preconditions.assertPresent(groupID, 'groupID');
        Preconditions.assertPresent(profileID, 'profileID');

        const clauses: ReadonlyArray<Clause> = [
            ['groupID', '==', groupID],
            ['profileID', '==', profileID]
        ];

        const firestore = FirestoreAdmin.getInstance();

        return await Collections.list(firestore, this.COLLECTION, clauses);

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

        const firestore = FirestoreAdmin.getInstance();

        return await Collections.list(firestore, this.COLLECTION, clauses);

    }

    public static async listByGroupID(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDoc>> {
        Preconditions.assertPresent(groupID, 'groupID');
        const firestore = FirestoreAdmin.getInstance();

        return await Collections.listByFieldValue(firestore, this.COLLECTION, 'groupID', groupID);
    }

    public static async set(batch: IWriteBatch<unknown>,
                            idUser: IDUser,
                            groupID: GroupIDStr,
                            docRef: DocRef) {

        if (! idUser.profile) {
            throw new Error("No profile");
        }

        const profileID = idUser.profile.id;

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
