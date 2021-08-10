import {IBaseContent} from "./IBaseContent";

export type DateContentFormat = 'YYYY-MM-DD';
export type TimezoneStr = string;
export type LocaleStr = string;

export interface IDateContent extends IBaseContent {
    readonly type: 'date';
    readonly data: string;
    readonly format: DateContentFormat;
}
