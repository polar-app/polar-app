
/**
 * The note metadata we need to sync to the store.
 */
export interface NoteDescriptor {

    /**
     * The globally unique and immutable identifier for this note even if it's
     * edited.
     */
    readonly guid: string;
    readonly deckName: string;
    readonly modelName: string;
    readonly fields: {[name: string]: string};
    readonly tags: string[];

}

