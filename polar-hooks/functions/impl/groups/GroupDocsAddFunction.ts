import {GroupIDStr} from './db/Groups';
import {Groups} from './db/Groups';
import {Firestore} from '../util/Firestore';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {UserRequests} from '../util/UserRequests';
import {IDUser} from '../util/IDUsers';
import {GroupDocActions} from "./db/GroupDocActions";
import {DocRef} from 'polar-shared/src/groups/DocRef';

export class GroupDocsAddFunctions {

    public static async exec(idUser: IDUser,
                             request: GroupDocAddRequest) {

        const {groupID} = request;
        const {uid} = idUser;

        const group = await Groups.verifyAccess(uid, groupID);

        const firestore = Firestore.getInstance();
        const batch = firestore.batch();

        if (request.docs.length === 0) {
            console.warn("No documents given to add");
        }

        for (const doc of request.docs) {
            await GroupDocActions.addToGroup(batch, idUser, groupID, doc, group.visibility);
        }

        await batch.commit();

    }

}

/**
 */
export const GroupDocsAddFunction = ExpressFunctions.createHook('GroupDocsAddFunction', (req, res) => {
    UserRequests.execute(req, res, GroupDocsAddFunctions.exec);
});

export interface GroupDocAddRequest {
    readonly groupID: GroupIDStr;
    readonly docs: ReadonlyArray<DocRef>;
}

