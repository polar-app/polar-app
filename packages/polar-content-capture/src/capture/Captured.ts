import {Browser} from './Browser';
import {AdBlockResult} from './AdBlocker';

export interface Captured {

    readonly capturedDocuments: {readonly [url: string]: CapturedDoc};

    /**
     * The type of this captured content.  Right now we only support PHZ but
     * there might be other formats in the future.
     */
    readonly type: 'phz';

    readonly version: string;

    readonly title: string;

    readonly url: string;

    /**
     *
     * @deprecated Use scrollBox instead.
     */
    readonly scroll?: ScrollBox;

    readonly scrollBox?: ScrollBox;

    /**
     * This is added after the capture is complete but usually present in the
     * result.  Older formats did not have this field though.
     */
    readonly browser?: Browser;

}

export interface CapturedDoc {

    readonly title: string;
    readonly href: string;
    readonly url: string;
    readonly scrollHeight: number;
    readonly scrollBox: ScrollBox;

    /**
     * The content as an HTML string
     */
    readonly content: string;

    /**
     * The length of the content in number of characters.  This is NOT
     * the content length which would be the number of bytes.
     */
    readonly contentTextLength: number;

    readonly mutations: Mutations;

    readonly docTypeFormat?: DocTypeFormat;

    /**
     * The HTML content type from document.contentType
     */
    readonly contentType?: string;

}

export interface ScrollBox {

    readonly width: number;
    readonly widthOverflow?: Overflow;

    readonly height: number;
    readonly heightOverflow?: Overflow;

}

export interface Mutations {
    readonly eventAttributesRemoved: number;
    readonly existingBaseRemoved: boolean;
    readonly baseAdded: boolean;
    readonly javascriptAnchorsRemoved: number;
    readonly cleanupRemoveScripts: any;
    readonly cleanupHead: any;
    readonly cleanupBase: any;
    readonly showAriaHidden: number;
    readonly adsBlocked?: AdBlockResult;
}

export type Overflow = 'visible' | 'hidden';

export type DocTypeFormat = 'html' | 'xml';
