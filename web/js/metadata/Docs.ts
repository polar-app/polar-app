import {Doc} from './Doc';
import {DatastorePermission} from '../datastore/Datastore';
import {DocMeta} from './DocMeta';

export class Docs {

    public static create(docMeta: DocMeta, permission: DatastorePermission): Doc {

        const mutable = permission.mode === 'rw';

        return {
            docMeta,
            docInfo: docMeta.docInfo,
            permission,
            mutable
        };

    }

}
