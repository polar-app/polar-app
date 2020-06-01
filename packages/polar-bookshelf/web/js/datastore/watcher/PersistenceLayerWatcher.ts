import {Reactor} from '../../reactor/Reactor';

/**
 * Persistence watcher that allow us to monitor the persistence layer for
 * changes to DocMeta.
 */
export interface IPersistenceLayerWatcher {

    /**
     * Add a listener to detect persistence layer changes.
     */
    addEventListener(listener: IPersistenceLayerListener): void;

}

export interface IPersistenceLayerListener {
    (event: DocMetaEvent): void
}

export interface DocMetaEvent {
    path: string;
    fileType: FileType;
    eventType: EventType;
}

export enum FileType {
    DOC_META = 'doc_meta',
    UNKNOWN = 'unknown'
}


export enum EventType {
    CREATED = 'created',
    DELETED = 'deleted',
    MODIFIED = 'modified',
    RENAMED = 'renamed',
}
