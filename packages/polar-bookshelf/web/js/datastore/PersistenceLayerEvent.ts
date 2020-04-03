import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {DocMetaRef} from './DocMetaRef';
import {PersistenceEventType} from './PersistenceEventType';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export interface PersistenceLayerEvent {

    /**
     * The actual docMeta or undefined if deleted.
     */
    readonly docMeta: IDocMeta | undefined;

    readonly docInfo: IDocInfo;
    readonly docMetaRef: DocMetaRef;
    readonly eventType: PersistenceEventType;
}
