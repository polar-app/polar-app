import {GroupIDStr} from './Groups';
import * as admin from 'firebase-admin';
import {IDUser} from '../../util/IDUsers';
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {UserIDStr} from "polar-shared/src/util/Strings";
import {Collections} from "polar-firestore-like/src/Collections";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import FieldValue = admin.firestore.FieldValue;


export class UserGroups {

    public static readonly COLLECTION = 'user_group';

    public static async get(uid: UserIDStr): Promise<UserGroup | undefined> {
        const firestore = FirestoreAdmin.getInstance();
        return await Collections.getByID(firestore, this.COLLECTION, uid);
    }

    public static doc(uid: UserIDStr) {
        const firestore = FirestoreAdmin.getInstance()
        return firestore.collection(this.COLLECTION).doc(uid);
    }

    public static deleteByGroupID(batch: IWriteBatch<unknown>,
                                  uid: UserIDStr,
                                  groupID: GroupIDStr) {

        const ref = this.doc(uid);

        batch.set(ref, {
            uid,
            groups: FieldValue.arrayRemove(groupID),
            invitations: FieldValue.arrayRemove(groupID),
            admin: FieldValue.arrayRemove(groupID),
            moderator: FieldValue.arrayRemove(groupID)
        });

    }

    public static updateOrCreate(batch: IWriteBatch<unknown>,
                                 idUser: IDUser,
                                 groupID: GroupIDStr,
                                 isAdmin: boolean = false,
                                 isModerator: boolean = false) {

        const {uid} = idUser;
        const ref = this.doc(uid);

        const record: any = {
            uid,
            groups: FieldValue.arrayUnion(groupID),
        };

        if (isAdmin) {
            record.admin = FieldValue.arrayUnion(groupID);
        }

        if (isModerator) {
            record.moderator = FieldValue.arrayUnion(groupID);
        }

        batch.set(ref,
                  record,
                  {merge: true});

    }

    public static addInvitation(batch: IWriteBatch<unknown>,
                                idUser: IDUser,
                                groupID: GroupIDStr) {

        const {uid} = idUser;
        const ref = this.doc(uid);

        batch.set(ref, {
                    uid,
                      invitations: FieldValue.arrayUnion(groupID),
                  },
                  {merge: true});

    }

    public static removeInvitation(batch: IWriteBatch<unknown>,
                                   idUser: IDUser,
                                   groupID: GroupIDStr) {

        const {uid} = idUser;
        const ref = this.doc(uid);

        batch.set(ref, {
                      uid,
                      invitations: FieldValue.arrayRemove(groupID),
                  },
                  {merge: true});

    }

}

interface UserGroupInit {

    /**
     * The UID for this record so the user can read their own values.
     */
    readonly uid: UserIDStr;

    readonly groups: FirestoreTypedArray<GroupIDStr>;

    readonly invitations: FirestoreTypedArray<GroupIDStr>;

    /**
     * The groups in which the user is an admin.
     */
    readonly admin: FirestoreTypedArray<GroupIDStr>;

    /**
     * The groups in which the user is a moderator.
     */
    readonly moderator: FirestoreTypedArray<GroupIDStr>;

}

interface UserGroup extends UserGroupInit {

}
