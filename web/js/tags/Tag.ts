
export interface Tag {

    /**
     * The actual id for the tag which is unique across all tags.
     */
    readonly id: string;

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
