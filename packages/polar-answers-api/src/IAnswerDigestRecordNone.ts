import {ShingleID} from "./ShingleID";

export interface IAnswerDigestRecordNone {
    readonly type: 'none';
    readonly id: ShingleID;
    readonly idx: number;
    readonly text: string;
}
