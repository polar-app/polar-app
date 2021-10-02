import {Percentages} from "./Percentages";
import {Strings} from "./Strings";
import {ErrorType} from "./Errors";

/**
 * A regression framework for running tests that return boolean and we can then
 * print a matrix and overall accuracy report.
 */

export namespace RegressionEngines {

    export type ResultType = string | number | boolean;

    export interface IRegressionTestResult<R extends ResultType> {

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

    export interface IRegressionTestError {
        readonly status: 'fail';
        readonly err: ErrorType;
    }

    export interface IRegressionTestName {
        readonly testName: string;
    }

    /**
     * A basic regression test will 'pass' as long as it doesn't throw an
     * exception.
     */
    export type RegressionTest<R extends ResultType> = () => Promise<IRegressionTestResult<R>>;

    export interface RegressionExecResult {
        readonly nrPass: number;
        readonly nrFail: number;
        readonly accuracy: number;
    }

    export interface IRegressionEngine<R extends ResultType> {

        /**
         * Register a test.
         */
        readonly register: (testName: string, test: RegressionTest<R>) => void;

        /**
         * Skip a test... it's just not registered but you don't need to comment it out.
         */
        readonly xregister: (testName: string, test: RegressionTest<R>) => void;

        /**
         * Execute the regression engine with all registered tests.
         */
        readonly exec: () => Promise<RegressionExecResult>;

    }

    export function create<R extends ResultType>(): IRegressionEngine<R> {

        interface IRegressionTestEntry {
            readonly testName: string;
            readonly test: RegressionTest<R>;
        }

        const regressions: IRegressionTestEntry[] = [];

        function register(testName: string, test: RegressionTest<R>) {
            regressions.push({testName, test});
        }

        function xregister(testName: string, test: RegressionTest<R>) {
            // noop
        }

        async function exec() {

            type IRegressionTestResultExecuted
                = (IRegressionTestResult<R> & IRegressionTestName) |
                  (IRegressionTestError & IRegressionTestName);

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
