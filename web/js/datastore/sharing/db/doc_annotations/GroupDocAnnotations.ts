import {GroupIDStr} from "../../../Datastore";
import {BaseDocAnnotation} from "./BaseDocAnnotation";
import {Collections, OrderByClause} from "../Collections";
import {IDStr} from "polar-shared/src/util/Strings";
import {Arrays} from "../../../../util/Arrays";

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

        const limit = 1;

        const results: ReadonlyArray<GroupDocAnnotation>
            = await Collections.list(this.COLLECTION, [['id', '==', id]], {limit});

        return Arrays.first(results);
    }

}

export interface GroupDocAnnotation extends BaseDocAnnotation {
    readonly groupID: GroupIDStr;
}
