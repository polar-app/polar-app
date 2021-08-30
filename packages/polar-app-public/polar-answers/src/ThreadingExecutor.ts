/**
 * Executor to execute threading requests.
 */
export namespace ThreadingExecutor {

    export interface IThreadingRequestForContext {
        readonly type: 'context';
    }

    export type IThreadingRequest = IThreadingRequestForContext;

}
