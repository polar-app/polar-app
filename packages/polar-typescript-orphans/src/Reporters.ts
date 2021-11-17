/**
 *
 */
export namespace Reporters {

    export interface IReporter {
        verbose: (msg: string, ...data: any[]) => void;
        info: (msg: string, ...data: any[]) => void;
    }

    export function create(doVerbose: boolean): IReporter {

        function verbose(msg: string, ...data: any[]) {
            if (doVerbose) {
                console.error(msg, ...data)
            }
        }

        function info(msg: string, ...data: any[]) {
            console.log(msg, ...data)
        }

        return {verbose, info};

    }

}
