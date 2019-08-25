import {GroupIDStr} from "../../../Datastore";
import {BaseDocAnnotation} from "./BaseDocAnnotation";
import {Collections, OrderByClause} from "../Collections";

export class GroupDocAnnotations {

    public static readonly COLLECTION = 'group_doc_annotation';

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDocAnnotation>> {

        // TODO we should really migrate this to use a a snapshot listener
        // so twe can watch when the data changes

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['added', 'desc']
        ];

        const limit = 50;

        return await Collections.list(this.COLLECTION, [['groupID', '==', groupID]], {limit, orderBy});

    }
}

export interface GroupDocAnnotation extends BaseDocAnnotation {
    readonly groupID: GroupIDStr;
}
