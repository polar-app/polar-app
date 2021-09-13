// eslint-disable-next-line @typescript-eslint/no-empty-interface
import {IRPCError} from "polar-shared/src/util/IRPCError";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAnswerExecutorTraceUpdateResponse {

}

export interface IAnswerExecutorTraceUpdateError extends IRPCError<'failed'> {
    readonly message: string;
}
