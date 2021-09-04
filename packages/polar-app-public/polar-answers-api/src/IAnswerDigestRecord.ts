import {IDStr} from "polar-shared/src/util/Strings";
import {ShingleID} from "./ShingleID";

export interface IAnswerDigestRecord {
    readonly id: ShingleID;
    readonly docID: IDStr;
    readonly idx: number;
    readonly pageNum: number;
    readonly text: string;
}
