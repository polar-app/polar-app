import {GroupIDStr} from './Groups';
import {JSONRPC} from './JSONRPC';
import {GroupProvisionResponse} from './GroupProvisions';

export class GroupJoins {
    public static async exec(request: GroupJoinRequest): Promise<GroupProvisionResponse> {
        return await JSONRPC.exec('groupJoin', request);
    }

}

export interface GroupJoinRequest {
    readonly groupID: GroupIDStr;
}

