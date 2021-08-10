import {IBaseContent} from "./IBaseContent";

export interface INameContent extends IBaseContent {
    readonly type: 'name';
    readonly data: string;
}
