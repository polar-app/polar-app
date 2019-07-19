import {JSONRPC} from './JSONRPC';
import {GroupIDStr} from '../../Datastore';
import {GroupDatastores, GroupDocRef} from "../GroupDatastores";
import {GroupMemberInvitation} from "../db/GroupMemberInvitations";
import {Logger} from "../../../logger/Logger";
import {PersistenceLayer} from "../../PersistenceLayer";
import {URLStr} from "../../../util/Strings";
import {URLParams} from "../../../util/URLParams";

const log = Logger.create();

export class GroupJoins {

    public static async exec(request: GroupJoinRequest): Promise<GroupJoinResponse> {
        return await JSONRPC.exec('groupJoin', request);
    }

    public static async execAndAdd(persistenceLayer: PersistenceLayer,
                                   invitation: GroupMemberInvitation) {

        const {groupID} = invitation;

        // the user has to join the group now...
        await GroupJoins.exec({groupID});

        // now we import from the group...
        for (const docRef of invitation.docs) {

            const groupDocRef: GroupDocRef = {
                groupID,
                docRef
            };

            log.info("Going to importFromGroup");
            await GroupDatastores.importFromGroup(persistenceLayer, groupDocRef);

        }

    }

    public static createShareURL(invitation: GroupMemberInvitation): URLStr {
        const param = URLParams.createJSON(invitation);
        return `http://app.getpolarized.io/add-shared-doc?invitation=${param}`;
    }

}

export interface GroupJoinRequest {
    readonly groupID: GroupIDStr;
}

export interface GroupJoinResponse {
}

