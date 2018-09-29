/**
 */
export enum ContextMenuType {

    /**
     * The default context menu.
     */
    DEFAULT = "DEFAULT",

    /**
     * A pagemark is selected.
     */
    PAGEMARK = "PAGEMARK",


    /**
     * Text is selected so we should have 'copy', 'create highlight', etc.
     */
    TEXT_SELECTED = "TEXT_SELECTED",


    /**
     * An annotation is selected.  We should have "add flashcard", etc.
     */
    ANNOTATION = "ANNOTATION",

    /**
     * A text highlight is selected.
     */
    TEXT_HIGHLIGHT = "TEXT_HIGHLIGHT",

    /**
     * An area highlight is selected.
     */
    AREA_HIGHLIGHT = "AREA_HIGHLIGHT",

    /**
     * We are hovering over a .page so add page specific options.
     */
    PAGE = "PAGE"

}

export class ContextMenuTypes {

    public static fromString(val: string) {
        return ContextMenuType[val as keyof typeof ContextMenuType];
    }

}
