import * as admin from 'firebase-admin';
import {GroupIDStr, GroupVisibility} from "./Groups";
import {DocPermissions} from "./DocPermissions";
import {GroupDocs} from "./GroupDocs";
import {IDUser} from "../../util/IDUsers";
import {DocIDStr, DocRef} from 'polar-shared/src/groups/DocRef';
import {GroupDocInfos} from "./GroupDocInfos";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import FieldValue = admin.firestore.FieldValue;

/**
 * Handles mutations for DocInfo, DocMeta, and DocPermission as these need to all be
 * mutated together.
 *
 */
export class GroupDocActions {

    private static readonly COLLECTIONS = ['doc_meta', 'doc_info', 'doc_permission'];

    public static async addToGroup(batch: IWriteBatch<unknown>,
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

    public static async removeFromGroup(batch: IWriteBatch<unknown>,
                                        groupID: GroupIDStr,
                                        docID: DocIDStr) {

        for (const collection of this.COLLECTIONS) {
            await this.leaveGroupForCollection(batch, collection, groupID, docID);
        }

    }

    public static setVisibility(batch: IWriteBatch<unknown>,
                                docID: DocIDStr,
                                visibility: GroupVisibility) {

        const firestore = FirestoreAdmin.getInstance();

        for (const collection of this.COLLECTIONS) {

            const ref = firestore.collection(collection).doc(docID);

            batch.update(ref, {
                visibility
            });

        }

    }

    private static addToGroupForCollection(batch: IWriteBatch<unknown>,
                                           collection: string,
                                           groupID: GroupIDStr,
                                           docID: DocIDStr,
                                           visibility: VisibilityMutation) {

        const firestore = FirestoreAdmin.getInstance();

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

    private static async leaveGroupForCollection(batch: IWriteBatch<unknown>,
                                                 collection: string,
                                                 groupID: GroupIDStr,
                                                 docID: DocIDStr) {

        const firestore = FirestoreAdmin.getInstance();

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
