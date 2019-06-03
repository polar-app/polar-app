
// TODO: this should be moved to the metadata package.
export interface Tag {

    /**
     * The actual id for the tag which is unique across all tags.
     */
    readonly id: TagIDStr;

    /**
     * The label to show in the UI.
     */
    readonly label: TagStr;

    /**
     * True when the tag is hidden.  Used for special types of tags that should
     * not be shown in the UI as they would just clutter the UI.
     */
    readonly hidden?: boolean;

}

/**
 * A string representation of a tag.
 */
export type TagStr = string;

/**
 * Just the tag ID, not the TagStr (which might not be unique).
 */
export type TagIDStr = string;
