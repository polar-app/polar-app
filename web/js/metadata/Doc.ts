import {DocInfo} from './DocInfo';
import {DatastorePermission} from '../datastore/Datastore';
import {DocMeta} from './DocMeta';
import {ObjectID} from '../util/ObjectIDs';


/**
 * A higher level representation of a Doc including the DocInfo and DocMeta
 * for use with providing additional metadata around DocMeta and DocInfo which
 * isn't necessarily written in the DocInfo/DocMeta including permission data.
 */
export interface Doc extends ObjectID {

    readonly docInfo: DocInfo;

    readonly docMeta: DocMeta;

    readonly permission: DatastorePermission;

    /**
     * True if the underlying document is mutable based on the permission
     * object and the datastore.
     */
    readonly mutable: boolean;

}
