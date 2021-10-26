import {ReadingProgress} from "./ReadingProgress";
import {IPageInfo} from "./IPageInfo";
import {IPagemark} from "./IPagemark";
import {INote} from "./INote";
import {IComment} from "./IComment";
import {IQuestion} from "./IQuestion";
import {IFlashcard} from "./IFlashcard";
import {ITextHighlight} from "./ITextHighlight";
import {IAreaHighlight} from "./IAreaHighlight";
import {IScreenshot} from "./IScreenshot";
import {IThumbnail} from "./IThumbnail";

/**
 * A dedicated type for a page number.  From range [1,infinity)
 */
export type PageNumber = number;

export interface IFlashcardMap {
    readonly [id: string]: IFlashcard;
}

export interface ICommentMap {
    readonly [id: string]: IComment;
}

export interface IPageMeta {

    /**
     * The pageInfo for this page.
     */
    readonly pageInfo: IPageInfo;

    /**
     * The index of page number to pagemark which stores the
     * data we need
     * for keeping track of pagemarks.  The index is the pagemark column.
     *
     */
    readonly pagemarks: { readonly [id: string]: IPagemark };

    /**
     * The note for this annotation.
     */
    readonly notes: { readonly [id: string]: INote };

    /**
     * The note for this annotation.
     */
    readonly comments: { readonly [id: string]: IComment };

    /**
     *
     */
    readonly questions: { readonly [id: string]: IQuestion };

    /**
     *
     */
    readonly flashcards: IFlashcardMap;

    /**
     * An index of test highlights for the page.
     *
     */
    readonly textHighlights: { readonly [id: string]: ITextHighlight };


    /**
     * An index of area highlights for the page.
     *
     */
    readonly areaHighlights: { readonly [id: string]: IAreaHighlight };

    /**
     * Screenshots we've taken of this page while performing annotations.
     *
     * @Deprecated we're no longer using this and instead storing the
     * screenshots directly along with the image with a 'rel' and then storing
     * all the 'attachments' in the DocInfo.  The list of attachments is small
     * plus we need to have the DocInfo be a smaller structure for the
     * representation of the doc itself.
     */
    readonly screenshots: { readonly [id: string]: IScreenshot };

    /**
     * The thumbnails for this page.  Usually, this is just one thumbnail
     * but there might be multiple.  If we want a specific noe we can just
     * look at the width and height.
     */
    readonly thumbnails: { readonly [id: string]: IThumbnail };

    readonly readingProgress: { readonly [id: string]: ReadingProgress };

}
