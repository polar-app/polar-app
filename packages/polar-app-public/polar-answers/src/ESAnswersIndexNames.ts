import {NamespaceIDStr} from "polar-blocks/src/blocks/IBlock";
import {Base16} from "polar-shared/src/util/Base16";

/**
 * Compute index names when a namespace is created or when we need get the index
 * for writing docs.
 */
export namespace ESAnswersIndexNames {

    const PREFIX = 'ai_ft_digest';

    /**
     * Compute the index name for a user.
     * @param uid The UID that owns this index.
     * @param id The namespace ID.
     */
    export function createForUserNotes(uid: string, id: NamespaceIDStr) {
        return PREFIX + '_notes_' + Base16.encode(uid)  + '_' + id;
    }

    /**
     * Compute the index name for a user.
     * @param uid The UID that owns this index.
     */
    export function createForUserDocs(uid: string) {
        return PREFIX + '_docs_' + Base16.encode(uid);
    }

}
