export class DefaultPersistenceLayerWatcher {

}

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
    DOC_META = 'doc_meta'
}


export enum EventType {
    CREATED = 'created',
    MODIFIED = 'modified',
    DELETED = 'deleted'
}
