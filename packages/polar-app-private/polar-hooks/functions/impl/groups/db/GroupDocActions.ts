import {WriteBatch} from "@google-cloud/firestore";
import * as admin from 'firebase-admin';
import FieldValue = admin.firestore.FieldValue;
import {GroupIDStr, GroupVisibility} from "./Groups";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {DocPermissions} from "./DocPermissions";
import {GroupDocs} from "./GroupDocs";
import {IDUser} from "../../util/IDUsers";
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {DocIDStr} from 'polar-shared/src/groups/DocRef';
import {GroupDocInfos} from "./GroupDocInfos";

/**
 * Handles mutations for DocInfo, DocMeta, and DocPermission as these need to all be
 * mutated together.
 *
 */
export class GroupDocActions {

    private static readonly COLLECTIONS = ['doc_meta', 'doc_info', 'doc_permission'];

    public static async addToGroup(batch: WriteBatch,
                                   idUser: IDUser,
                                   groupID: GroupIDStr,
                                   doc: DocRef,
                                   visibility: GroupVisibility) {

        const {docID} = doc;

        async function createDocPermissionWhenNecessary(idUser: IDUser,
                                                        doc: DocRef) {

            // TODO: I think this would be better as a transaction but they
            // should generally be slower

            const {docID} = doc;

            const docPermissionExists = await DocPermissions.exists(docID);

            if (! docPermissionExists) {
                await DocPermissions.create(idUser, doc);
            }

        }

        // just create an empty/blank doc permission so we can add groups to this later.
        await createDocPermissionWhenNecessary(idUser, doc);

        await GroupDocs.set(batch, idUser, groupID, doc);

        async function getCurrentVisibility(docID: DocIDStr) {

            const docPermission = await DocPermissions.get(docID);

            if (docPermission) {
                return docPermission.visibility;
            } else {
                return 'private';
            }

        }

        await GroupDocInfos.getOrCreate(batch, {groupID, ...doc});

        const currentVisibility = await getCurrentVisibility(docID);
        const visibilityMutation = {from: currentVisibility, to: visibility};

        for (const collection of this.COLLECTIONS) {
            this.addToGroupForCollection(batch, collection, groupID, docID, visibilityMutation);
        }

    }

    public static async removeFromGroup(batch: WriteBatch,
                                        groupID: GroupIDStr,
                                        docID: DocIDStr) {

        for (const collection of this.COLLECTIONS) {
            await this.leaveGroupForCollection(batch, collection, groupID, docID);
        }

    }

    public static setVisibility(batch: WriteBatch,
                                docID: DocIDStr,
                                visibility: GroupVisibility) {

        const app = FirebaseAdmin.app();
        const firestore = app.firestore();

        for (const collection of this.COLLECTIONS) {

            const ref = firestore.collection(collection).doc(docID);

            batch.update(ref, {
                visibility
            });

        }

    }

    private static addToGroupForCollection(batch: WriteBatch,
                                           collection: string,
                                           groupID: GroupIDStr,
                                           docID: DocIDStr,
                                           visibility: VisibilityMutation) {

        const app = FirebaseAdmin.app();
        const firestore = app.firestore();

        const ref = firestore.collection(collection).doc(docID);

        if (['public', 'protected'].includes(visibility.to)) {

            // when public or protected we have to change the high level visibility on the doc along with the groups.
            // technically the group doesn't need to be set BUT it's correct so that the document knows what
            // groups it belongs to plus if I change the visibility lower it can also be used with this group properly
            // in the future.

            if (GroupVisibilities.toInt(visibility.from) < GroupVisibilities.toInt(visibility.to)) {

                // upgrade the visibility but don't regress.
                batch.update(ref, {
                    visibility: visibility.to
                });

            }

        }

        batch.update(ref, {
            groups: FieldValue.arrayUnion(groupID),
        });

    }

    private static async leaveGroupForCollection(batch: WriteBatch,
                                                 collection: string,
                                                 groupID: GroupIDStr,
                                                 docID: DocIDStr) {

        const app = FirebaseAdmin.app();
        const firestore = app.firestore();

        const ref = firestore.collection(collection).doc(docID);

        const snapshot = await ref.get();

        if (snapshot.exists) {
            batch.update(ref, {
                groups: FieldValue.arrayRemove(groupID),
            });
        }

    }


}

export interface VisibilityMutation {
    readonly from: GroupVisibility;
    readonly to: GroupVisibility;
}

class GroupVisibilities {

    public static toInt(visibility: GroupVisibility) {

        switch (visibility) {
            case 'public':
                return 2;
            case 'protected':
                return 1;
            case 'private':
                return 0;
        }

        return 0;

    }

}
