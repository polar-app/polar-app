import {IAnswerExecutorTrace} from "./IAnswerExecutorTrace";

export type IAnswerExecutorTraceUpdate = Required<Pick<IAnswerExecutorTrace, 'id' | 'vote' | 'expectation'>>;
