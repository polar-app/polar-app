import {IBaseContent} from "./IBaseContent";
import {IHasLinksContent} from "./IHasLinksContent";

export interface INameContent extends IBaseContent, IHasLinksContent {
    readonly type: 'name';
    readonly data: string;
}
