
export type DateContentFormat = 'MMMM D, YYYY';
export type TimezoneStr = string;
export type LocaleStr = string;

export interface IDateContent {
    readonly type: 'date';
    readonly data: string;
    readonly timezone: TimezoneStr;
    readonly format: DateContentFormat;
    readonly locale: LocaleStr;
}
