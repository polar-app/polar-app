import {IOutlineItem} from "./IOutlineItem";

export interface IOutline {
    readonly items: ReadonlyArray<IOutlineItem>;
}
