/**
 *
 */
export namespace Reporters {

    export interface IReporter {
        readonly verbose: (msg: string, ...data: readonly any[]) => void;
        readonly info: (msg: string, ...data: readonly any[]) => void;
    }

    export function create(doVerbose: boolean): IReporter {

        function verbose(msg: string, ...data: readonly any[]) {
            if (doVerbose) {
                console.error(msg, ...data)
            }
        }

        function info(msg: string, ...data: readonly any[]) {
            console.log(msg, ...data)
        }

        return {verbose, info};

    }

}