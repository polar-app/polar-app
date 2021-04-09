import {HTMLStr} from "polar-shared/src/util/Strings";

/**
 * A data-format specific string like Markdown or HTML or JSON but that can be
 * converted to HTML
 */
export type DataStr = string;

export interface ContentEscaper<D extends DataStr> {

    readonly escape: (input: D) => HTMLStr;
    readonly unescape: (html: HTMLStr) => D;

}
