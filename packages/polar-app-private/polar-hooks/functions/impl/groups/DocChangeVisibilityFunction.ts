import {IDUser} from '../util/IDUsers';
import {Firestore} from '../util/Firestore';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {DocVisibility} from './db/DocPermissions';
import {GroupDocs} from './db/GroupDocs';
import {UserGroups} from './db/UserGroups';
import {GroupDocActions} from './db/GroupDocActions';
import {GroupIDStr} from './db/Groups';
import {DocIDStr} from 'polar-shared/src/groups/DocRef';
import {ArrayListMultimap, Multimap} from "polar-shared/src/util/Multimap";
import {Arrays} from "polar-shared/src/util/Arrays";

export class DocChangeVisibilityFunctions {

    public static async exec(idUser: IDUser,
                             request: DocChangeVisibilityRequest) {

        const firestore = Firestore.getInstance();

        const batch = firestore.batch();

        const profileID = idUser.profileID;
        const {docID} = request;

        if (request.visibility === 'private') {

            async function computeNonPrivateGroups(): Promise<Multimap<GroupIDStr, DocIDStr>> {

                const result: Multimap<GroupIDStr, DocIDStr> = new ArrayListMultimap();

                const userGroup = await UserGroups.get(idUser.uid);
                const privateGroups = new Set(userGroup ? Arrays.toArray(userGroup.groups) : []);

                // list all the groups this is a member of and actively using
                const groupDocs = await GroupDocs.listByDocIDAndProfileID(docID, profileID);

                for (const groupDoc of groupDocs) {

                    if (privateGroups.has(groupDoc.groupID)) {
                        continue;
                    }

                    result.put(groupDoc.groupID, groupDoc.docID);

                }

                return result;

            }

            const nonPrivateGroupIDs = await computeNonPrivateGroups();

            for (const nonPrivateGroupID of nonPrivateGroupIDs.keys()) {

                // we have to remove this document from public/protected groups now
                // and then finally set the visibility at the end.

                const docIDs = nonPrivateGroupIDs.get(nonPrivateGroupID);

                for (const docID of docIDs) {
                    // remove the document from the nonPrivate group
                    await GroupDocActions.removeFromGroup(batch, nonPrivateGroupID, docID);
                }

            }

        }

        // set the doc visibility private for these documents.

        GroupDocActions.setVisibility(batch, docID, request.visibility);

        await batch.commit();

    }

}

export const DocChangeVisibilityFunction = ExpressFunctions.createRPCHook('DocChangeVisibilityFunction', DocChangeVisibilityFunctions.exec);

export interface DocChangeVisibilityRequest {

    readonly docID: DocIDStr;
    readonly visibility: DocVisibility;

}

