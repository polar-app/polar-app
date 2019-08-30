import {GroupIDStr} from "../../../Datastore";
import {BaseDocAnnotation} from "./BaseDocAnnotation";
import {Collections, OrderByClause} from "../Collections";
import {IDStr} from "polar-shared/src/util/Strings";

export class GroupDocAnnotations {

    public static readonly COLLECTION = 'group_doc_annotation';

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDocAnnotation>> {

        // TODO we should really migrate this to use a a snapshot listener
        // so twe can watch when the data changes

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['lastUpdated', 'desc']
        ];

        const limit = 50;

        return await Collections.list(this.COLLECTION, [['groupID', '==', groupID]], {limit, orderBy});

    }

    public static async get(id: IDStr): Promise<GroupDocAnnotation | undefined> {
        return await Collections.getByID(this.COLLECTION, id);

    }

}

export interface GroupDocAnnotation extends BaseDocAnnotation {
    readonly groupID: GroupIDStr;
}
