import {IBaseContent} from "./IBaseContent";
import {IHasLinksContent} from "./IHasLinksContent";

export type DateContentFormat = 'YYYY-MM-DD';
export type TimezoneStr = string;
export type LocaleStr = string;

export interface IDateContent extends IBaseContent, IHasLinksContent {
    readonly type: 'date';
    readonly data: string;
    readonly format: DateContentFormat;
}
