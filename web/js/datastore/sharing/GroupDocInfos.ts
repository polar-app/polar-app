import {GroupIDStr} from "../Datastore";
import {Collections, OrderByClause} from "./db/Collections";
import {GroupDoc} from "./db/GroupDocs";

export class GroupDocInfos {

    public static readonly COLLECTION = 'group_doc_info';

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDoc>> {

        // TODO we should really migrate this to use a a snapshot listener...

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['added', 'desc']
        ];

        const limit = 50;

        return await Collections.list(this.COLLECTION, [['groupID', '==', groupID]], {limit, orderBy});
    }

}
