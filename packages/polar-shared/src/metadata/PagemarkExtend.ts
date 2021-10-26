import {Percentage100} from "../util/Percentages";

/**
 * A page ID greater than 1.
 */
export type PageID = number;

export interface PagemarkExtend {
    readonly origin: PageID;
    readonly page: PageID;
    readonly perc: Percentage100;
}
