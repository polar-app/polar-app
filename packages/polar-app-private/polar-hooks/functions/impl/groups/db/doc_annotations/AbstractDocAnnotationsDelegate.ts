import {Collections} from "../Collections";
import {GroupMemberInvitationIDStr} from "../GroupMemberInvitations";
import {DocumentReference, WriteBatch} from "@google-cloud/firestore";
import {Firestore} from "../../../util/Firestore";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {BaseDocAnnotation} from "./BaseDocAnnotations";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IDStr} from "polar-shared/src/util/Strings";

export class AbstractDocAnnotationsDelegate {

    constructor(public collection: string, public parentColumnName: string) {

    }

    public doc(record: BaseDocAnnotation): [GroupMemberInvitationIDStr, DocumentReference] {

        const firestore = Firestore.getInstance();
        const parent = (<any> record) [this.parentColumnName];

        const id = Hashcodes.create({id: record.id, parent});
        const doc = firestore.collection(this.collection).doc(id);
        return [id, doc];

    }

    public async list<T extends BaseDocAnnotation>(parent: string) {
        return await Collections.list<T>(this.collection, [[this.parentColumnName, '==', parent]]);
    }

    public write<T extends BaseDocAnnotation>(batch: WriteBatch, record: T) {

        const [id, ref] = this.doc(record);

        batch.set(ref, Dictionaries.onlyDefinedProperties(record));

    }

    public delete<T extends BaseDocAnnotation>(batch: WriteBatch, id: IDStr) {

        const firestore = Firestore.getInstance();
        const ref = firestore.collection(this.collection).doc(id);

        batch.delete(ref);

    }

}
