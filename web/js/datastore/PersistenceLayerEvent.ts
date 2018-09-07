import {IDocInfo} from '../metadata/DocInfo';
import {DocMetaRef} from './DocMetaRef';
import {PersistenceEventType} from './PersistenceEventType';

export interface PersistenceLayerEvent {
    docInfo: IDocInfo;
    docMetaRef: DocMetaRef;
    eventType: PersistenceEventType;
}
