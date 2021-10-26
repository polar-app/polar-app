import {GroupMemberInvitationIDStr} from "../GroupMemberInvitations";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {BaseDocAnnotation} from "./BaseDocAnnotations";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IDStr} from "polar-shared/src/util/Strings";
import {IDocumentReference} from "polar-firestore-like/src/IDocumentReference";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {Collections} from "polar-firestore-like/src/Collections";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

export class AbstractDocAnnotationsDelegate {

    constructor(public readonly collection: string, public readonly parentColumnName: string) {

    }

    public doc(record: BaseDocAnnotation): readonly [GroupMemberInvitationIDStr, IDocumentReference<unknown>] {

        const firestore = FirestoreAdmin.getInstance();
        const parent = (<any> record) [this.parentColumnName];

        const id = Hashcodes.create({id: record.id, parent});
        const doc = firestore.collection(this.collection).doc(id);
        return [id, doc];

    }

    public async list<T extends BaseDocAnnotation>(parent: string) {
        const firestore = FirestoreAdmin.getInstance();
        return await Collections.list<T>(firestore, this.collection, [[this.parentColumnName, '==', parent]]);
    }

    public write<T extends BaseDocAnnotation>(batch: IWriteBatch<unknown>, record: T) {

        const [id, ref] = this.doc(record);

        batch.set(ref, Dictionaries.onlyDefinedProperties(record));

    }

    public delete<T extends BaseDocAnnotation>(batch: IWriteBatch<unknown>, id: IDStr) {

        const firestore = FirestoreAdmin.getInstance();
        const ref = firestore.collection(this.collection).doc(id);

        batch.delete(ref);

    }

}
