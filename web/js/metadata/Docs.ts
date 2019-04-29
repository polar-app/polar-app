import {Doc} from './Doc';
import {DatastorePermission} from '../datastore/Datastore';
import {DocMeta} from './DocMeta';
import {ObjectIDs} from '../util/ObjectIDs';

export class Docs {

    public static create(docMeta: DocMeta, permission: DatastorePermission): Doc {

        const mutable = permission.mode === 'rw';

        return {
            oid: ObjectIDs.create(),
            docMeta,
            docInfo: docMeta.docInfo,
            permission,
            mutable
        };

    }

}
