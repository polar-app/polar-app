export interface CapturedContent {

}

export interface CapturedDoc {

    title: string;
    href: string;
    url: string;
    scrollHeight: number;
    scrollBox: ScrollBox;

    /**
     * The content as an HTML string
     */
    content: string;

    /**
     * The length of the content in number of characters.  This is NOT
     * the content length which would be the number of bytes.
     */
    contentTextLength: number;

    mutations: Mutations;

}

export interface ScrollBox {
    width: number;
    height: number;
}

export interface Mutations {
    eventAttributesRemoved: number;
    existingBaseRemoved: boolean;
    baseAdded: boolean;
    javascriptAnchorsRemoved: number;
    cleanupRemoveScripts: any;
    cleanupHead: any;
    cleanupBase: any;
    showAriaHidden: number;
}
