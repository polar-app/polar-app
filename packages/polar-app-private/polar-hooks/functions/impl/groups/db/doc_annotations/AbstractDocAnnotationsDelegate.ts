import {GroupMemberInvitationIDStr} from "../GroupMemberInvitations";
import {Firestore} from "../../../util/Firestore";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {BaseDocAnnotation} from "./BaseDocAnnotations";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IDStr} from "polar-shared/src/util/Strings";
import {IDocumentReference} from "polar-firestore-like/src/IDocumentReference";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {Collections} from "polar-firestore-like/src/Collections";

export class AbstractDocAnnotationsDelegate {

    constructor(public collection: string, public parentColumnName: string) {

    }

    public doc(record: BaseDocAnnotation): [GroupMemberInvitationIDStr, IDocumentReference<unknown>] {

        const firestore = Firestore.getInstance();
        const parent = (<any> record) [this.parentColumnName];

        const id = Hashcodes.create({id: record.id, parent});
        const doc = firestore.collection(this.collection).doc(id);
        return [id, doc];

    }

    public async list<T extends BaseDocAnnotation>(parent: string) {
        const firestore = Firestore.getInstance();
        return await Collections.list<T>(firestore, this.collection, [[this.parentColumnName, '==', parent]]);
    }

    public write<T extends BaseDocAnnotation>(batch: IWriteBatch<unknown>, record: T) {

        const [id, ref] = this.doc(record);

        batch.set(ref, Dictionaries.onlyDefinedProperties(record));

    }

    public delete<T extends BaseDocAnnotation>(batch: IWriteBatch<unknown>, id: IDStr) {

        const firestore = Firestore.getInstance();
        const ref = firestore.collection(this.collection).doc(id);

        batch.delete(ref);

    }

}
