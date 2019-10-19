import {WriteBatch} from "@google-cloud/firestore";
import {GroupIDStr} from './Groups';
import {FirebaseAdmin} from '../../util/FirebaseAdmin';
import * as admin from 'firebase-admin';
import {UserIDStr} from './Profiles';
import {IDUser} from '../../util/IDUsers';
import {Collections} from './Collections';
import FieldValue = admin.firestore.FieldValue;


export class UserGroups {

    public static readonly COLLECTION = 'user_group';

    public static async get(uid: UserIDStr): Promise<UserGroup | undefined> {
        return await Collections.getByID(this.COLLECTION, uid);
    }

    public static doc(uid: UserIDStr) {
        const app = FirebaseAdmin.app();
        const firestore = app.firestore();
        return firestore.collection(this.COLLECTION).doc(uid);
    }

    public static deleteByGroupID(batch: WriteBatch,
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

    public static updateOrCreate(batch: WriteBatch,
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

    public static addInvitation(batch: WriteBatch,
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

    public static removeInvitation(batch: WriteBatch,
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

    readonly groups: ReadonlyArray<GroupIDStr>;

    readonly invitations: ReadonlyArray<GroupIDStr>;

    /**
     * The groups in which the user is an admin.
     */
    readonly admin: ReadonlyArray<GroupIDStr>;

    /**
     * The groups in which the user is a moderator.
     */
    readonly moderator: ReadonlyArray<GroupIDStr>;

}

interface UserGroup extends UserGroupInit {

}
