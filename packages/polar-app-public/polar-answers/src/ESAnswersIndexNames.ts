import {NamespaceIDStr} from "polar-blocks/src/blocks/IBlock";
import {Base16} from "polar-shared/src/util/Base16";

/**
 * Compute index names when a namespace is created or when we need get the index
 * for writing docs.
 */
export namespace ESAnswersIndexNames {

    const PREFIX = 'answers_ft_digest_';

    /**
     * Compute the index name for a user.
     * @param uid The UID that owns this index.
     * @param id The namespace ID.
     */
    export function createForUserNotes(uid: string, id: NamespaceIDStr) {
        return PREFIX + Base16.encode(uid) + '_notes_' +  + '_' + id;
    }

    /**
     * Compute the index name for a user.
     * @param uid The UID that owns this index.
     */
    export function createForUserDocs(uid: string) {
        return PREFIX + Base16.encode(uid) + '_docs';
    }

}
