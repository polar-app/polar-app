/**
 * Outline node which contains a URL that can be triggered when navigation
 * changes, a title, and children.
 */
export interface IOutline {

    /**
     * The title of this outline item for display in the UI.
     */
    readonly title: string;

    /**
     * The location string to trigger the viewer to jump to this outline
     * position.  Undefined if it's not a location but just a placeholder in
     * the outline.
     */
    readonly location: string | undefined;

    /**
     * The child nodes under this outline. Not to be confused with React children.
     */
    readonly children: ReadonlyArray<IOutline>;

}
