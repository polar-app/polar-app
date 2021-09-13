import {IAnswerExecutorTrace} from "./IAnswerExecutorTrace";

export type IAnswerExecutorTraceUpdate = Pick<IAnswerExecutorTrace, 'id' | 'vote' | 'expectation'>;
