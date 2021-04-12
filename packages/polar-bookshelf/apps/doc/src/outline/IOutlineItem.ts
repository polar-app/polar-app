export type OutlineLocation = string;

/**
 * Outline node which contains a URL that can be triggered when navigation
 * changes, a title, and children.
 */
export interface IOutlineItem {

    readonly id: string;

    /**
     * The title of this outline item for display in the UI.
     */
    readonly title: string;

    /**
     * The destination string to trigger the viewer to jump to this outline
     * position.  Undefined if it's not a location but just a placeholder in
     * the outline.
     */
    readonly destination: any;

    /**
     * The child nodes under this outline. Not to be confused with React children.
     */
    readonly children: ReadonlyArray<IOutlineItem>;

}

export type OutlineNavigator = (destination: any) => Promise<void>;
