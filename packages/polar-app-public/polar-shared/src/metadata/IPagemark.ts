import {PagemarkType} from "./PagemarkType";
import {PagemarkMode} from "./PagemarkMode";
import {IAnnotation} from "./IAnnotation";
import {INote} from "./INote";
import {IPagemarkRect} from "./IPagemarkRect";

export interface IPagemark extends IAnnotation {

    /**
     * The note for this annotation.
     */
    notes: { [id: string]: INote };

    /**
     * The type of pagemark.
     *
     */
    type: PagemarkType;

    /**
     * The total percentage of the page that is covered with the page mark.
     * From 0 to 100.  This factors in the total rows and columns on the
     * page and is the raw percentage value of the page.
     *
     */
    percentage: number;

    /**
     * The column number on which this pagemark is rendered.  This is mostly
     * metadata and we should be migrating to PagemarkRect and PagemarkRange
     * which supports raw rendering of the pagemarks.
     */
    column: number;

    /**
     * The PagemarkRect for this pagemark. When not specified we use a box of
     *
     * { top: 0, left: 0, width: 100, height: 100 }
     *
     * or the whole page.
     *
     */
    rect: IPagemarkRect;

    /**
     * The mode of this pagemark (read, ignored, etc).
     */
    mode: PagemarkMode;

    /**
     * A batch is used when creating multiple pagemarks over multiple pages.
     *
     * We can then change settings on the entire, batch at once.  The batch
     * is created with one unique operation across several pages.
     *
     */
    batch?: string;

}
