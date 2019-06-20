import {GroupIDStr} from '../db/Groups';
import {JSONRPC} from './JSONRPC';

export class GroupJoins {

    public static async exec(request: GroupJoinRequest): Promise<GroupJoinResponse> {
        return await JSONRPC.exec('groupJoin', request);
    }

}

export interface GroupJoinRequest {
    readonly groupID: GroupIDStr;
}

export interface GroupJoinResponse {
}

