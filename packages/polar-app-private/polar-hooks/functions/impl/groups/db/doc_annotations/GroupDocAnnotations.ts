import {AbstractDocAnnotationsDelegate} from "./AbstractDocAnnotationsDelegate";
import {BaseDocAnnotation} from "./BaseDocAnnotations";
import {GroupIDStr} from "../Groups";
import {WriteBatch} from "@google-cloud/firestore";
import {IDStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Collections} from "../Collections";

export class GroupDocAnnotations {

    public static readonly COLLECTION = 'group_doc_annotation';

    private static delegate = new AbstractDocAnnotationsDelegate(GroupDocAnnotations.COLLECTION, 'groupID');

    public static async get(id: IDStr): Promise<GroupDocAnnotation | undefined> {
        return Collections.getByIDWithQuery(this.COLLECTION, id);
    }

    public static createID(groupID: GroupIDStr, id: IDStr) {
        return Hashcodes.create({groupID, id});
    }

    public static convert(groupID: GroupIDStr, record: BaseDocAnnotation): GroupDocAnnotation {
        const id = this.createID(groupID, record.id);
        return {...record, id, groupID};
    }

    public static list(parent: string): Promise<ReadonlyArray<GroupDocAnnotation>> {
        return this.delegate.list(parent);
    }

    public static write(batch: WriteBatch,
                        record: GroupDocAnnotation) {

        this.delegate.write(batch, record);

    }

    public static delete(batch: WriteBatch, id: IDStr) {
        this.delegate.delete(batch, id);
    }

}

export interface GroupDocAnnotation extends BaseDocAnnotation {
    readonly groupID: GroupIDStr;
}
