/**
 * Just like a DocDetail or DocInfo but designed to be used for in the UI so we
 * replace missing titles with Untitled and define other default values.
 */
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {Img} from 'polar-shared/src/metadata/Img';
import {Tag} from 'polar-shared/src/tags/Tags';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IComment} from 'polar-shared/src/metadata/IComment';
import {HTMLStr, IDStr, PlainTextStr} from "polar-shared/src/util/Strings";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

// TODO: a lot of duplication here between DocAnnotations DocAnnotation

export interface RepoAnnotation {

    /**
     * The document fingerprint this annotation belongs to.
     */
    readonly fingerprint: string;

    readonly id: IDStr;

    readonly guid: IDStr;

    readonly text: PlainTextStr | undefined;

    // readonly html: HTMLStr;

    readonly annotationType: AnnotationType;

    readonly created: ISODateTimeString;

    readonly tags: Readonly<{[id: string]: Tag}> | undefined;

    readonly color: HighlightColor | undefined;

    readonly img: Img | undefined;

    readonly docMeta: IDocMeta;

    // readonly pageMeta: IPageMeta;

    readonly original: IFlashcard | IAreaHighlight | ITextHighlight | IComment;

}

/**
 * Additional metadata on a highlight.
 * @Deprecated
 */
export interface RepoHighlightInfo {
    color?: HighlightColor;
}
