import {IBaseContent} from "./IBaseContent";
import {IHasLinksContent} from "./IHasLinksContent";

export interface IMarkdownContent extends IBaseContent, IHasLinksContent {
    readonly type: 'markdown';
    readonly data: string;
}
