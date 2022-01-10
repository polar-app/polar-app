export type DocumentChangeType = 'added' |  'modified' | 'removed';

/**
 * Provides a Firebase-like snapshot API bug uses generics and actual coverted objects.
 */
export interface IGenericDocumentChange<T> {
    readonly id: string;
    readonly type: DocumentChangeType;
    readonly data: () => T;
}
