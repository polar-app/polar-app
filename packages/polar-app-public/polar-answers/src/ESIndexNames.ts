import {NamespaceIDStr} from "polar-blocks/src/blocks/IBlock";

/**
 * Compute index names when a namespace is created or when we need get the index
 * for writing docs.
 */
export namespace ESIndexNames {

    const PREFIX = 'ft-digest-';

    /**
     * Compute the index name for a user.
     * @param uid The UID that owns this index.
     * @param id The namespace ID.
     */
    export function createForUserNotes(uid: string, id: NamespaceIDStr) {
        return PREFIX + uid + '-notes-' +  + '-' + id;
    }

    /**
     * Compute the index name for a user.
     * @param uid The UID that owns this index.
     */
    export function createForUserDocs(uid: string) {
        return PREFIX + uid + '-docs';
    }

}
