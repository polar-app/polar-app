import {Percentages} from "./Percentages";
import {Strings} from "./Strings";
import {ErrorType} from "./Errors";

/**
 * A regression framework for running tests that return boolean and we can then
 * print a matrix and overall accuracy report.
 */

export namespace RegressionEngines {

    export type ResultType = string | number | boolean;

    export interface IRegressionTestResultPass<R extends ResultType> {

        /**
         * The status of this regression result ... pass or fail.
         */
        readonly status: 'pass' | 'fail';

        /**
         * The actual value.
         */
        readonly actual: R;

        /**
         * The expected value.
         */
        readonly expected: R | ReadonlyArray<R>;

        /**
         * Metadata for this result.
         */
        readonly metadata?: Readonly<{[key: string]: string | number | boolean}>;

    }

    export interface IRegressionTestResultError<E> {
        readonly status: 'fail';
        readonly err: E;
        readonly metadata?: Readonly<{[key: string]: string | number | boolean}>;

    }

    export interface IRegressionTestName {
        readonly testName: string;
    }

    /**
     * A basic regression test will 'pass' as long as it doesn't throw an
     * exception.
     */
    export type RegressionTest<R extends ResultType, E> = () => Promise<IRegressionTestResultPass<R> | IRegressionTestResultError<E>>;

    export interface RegressionExecResult {
        readonly nrPass: number;
        readonly nrFail: number;
        readonly accuracy: number;
    }

    export interface IRegressionEngine<R extends ResultType, E> {

        /**
         * Register a test.
         */
        readonly register: (testName: string, test: RegressionTest<R, E>) => void;

        /**
         * Skip a test... it's just not registered but you don't need to comment it out.
         */
        readonly xregister: (testName: string, test: RegressionTest<R, E>) => void;

        /**
         * Execute the regression engine with all registered tests.
         */
        readonly exec: () => Promise<RegressionExecResult>;

    }

    /**
     * Specify the error type using E which should probably be ErrorType but
     * could also be a code.  Normally, both ErrorType and a list of codes is
     * probably best.
     */
    export function create<R extends ResultType, E>(): IRegressionEngine<R, E> {

        interface IRegressionTestEntry {
            readonly testName: string;
            readonly test: RegressionTest<R, E>;
        }

        const regressions: IRegressionTestEntry[] = [];

        function register(testName: string, test: RegressionTest<R, E>) {
            regressions.push({testName, test});
        }

        function xregister(testName: string, test: RegressionTest<R, E>) {
            // noop
        }

        async function exec() {

            type IRegressionTestResultExecuted
                = (IRegressionTestResultPass<R> & IRegressionTestName) |
                  (IRegressionTestResultError<E> & IRegressionTestName) |
                  (IRegressionTestResultError<ErrorType> & IRegressionTestName);

            async function doTests(): Promise<ReadonlyArray<IRegressionTestResultExecuted>> {

                console.log("=== Running regression tests...");

                const results: IRegressionTestResultExecuted[] = [];

                for (const testEntry of regressions) {

                    console.log("=== Running regression test: " + testEntry.testName);

                    try {

                        const testResult = await testEntry.test();

                        results.push({
                            testName: testEntry.testName,
                            ...testResult
                        });

                    } catch (e) {
                        console.error(`Failed to run regression test: ${testEntry.testName}`, e);
                        results.push({
                            testName: testEntry.testName,
                            status: 'fail',
                            err: e
                        });
                    }

                }

                console.log("=== Running regression tests...done");

                return results;

            }

            function doReport(results: ReadonlyArray<IRegressionTestResultExecuted>): RegressionExecResult {

                const nrPass = results.filter(current => current.status === 'pass').length;
                const nrFail = results.filter(current => current.status === 'fail').length;
                const nrTests = results.length;

                const accuracy = Percentages.calculate(nrPass, nrTests);

                console.log("========");

                for(const result of results) {
                    // TODO print metadata
                    // TODO: show actual ...
                    console.log(Strings.rpad(result.testName, ' ', 25) + " : " + result.status + " " + ((result as any).actual || ''));
                }

                console.log("========");
                console.log("pass:     " + nrPass);
                console.log("fail:     " + nrFail);
                console.log("accuracy: " + accuracy);

                return {nrPass, nrFail, accuracy}

            }

            const results = await doTests();
            return doReport(results);

        }

        return {register, xregister, exec};

    }

}
