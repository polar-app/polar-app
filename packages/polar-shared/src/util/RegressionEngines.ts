import {Percentages} from "./Percentages";
import {Strings} from "./Strings";
import {ErrorType} from "./Errors";

/**
 * A regression framework for running tests that return boolean and we can then
 * print a matrix and overall accuracy report.
 */

export namespace RegressionEngines {

    /**
     * A basic regression test will 'pass' as long as it doesn't throw an
     * exception.
     */
    export type RegressionTest<A> = () => Promise<A>;

    export interface RegressionResult {
        readonly nrPass: number;
        readonly nrFail: number;
        readonly accuracy: number;
    }

    export interface IRegressionEngine<A> {

        /**
         * Register a test.
         */
        readonly register: (testName: string, test: RegressionTest<A>) => void;

        /**
         * Skip a test... it's just not registered but you don't need to comment it out.
         */
        readonly xregister: (testName: string, test: RegressionTest<A>) => void;

        /**
         * Execute the regression engine with all registered tests.
         */
        readonly exec: () => Promise<RegressionResult>;

    }

    export function create<A>(): IRegressionEngine<A> {

        interface IRegressionTestEntry {
            readonly testName: string;
            readonly test: RegressionTest<A>;
        }

        interface IRegressionTestResultPass {
            readonly testName: string;
            readonly result: 'pass';
        }

        interface IRegressionTestResultFail {
            readonly testName: string;
            readonly result: 'fail';
            readonly err: ErrorType
        }

        type IRegressionTestResult = IRegressionTestResultPass | IRegressionTestResultFail;

        const regressions: IRegressionTestEntry[] = [];

        function register(testName: string, test: RegressionTest<A>) {
            regressions.push({testName, test});
        }

        function xregister(testName: string, test: RegressionTest<A>) {
            // noop
        }

        async function exec() {

            async function doTests(): Promise<ReadonlyArray<IRegressionTestResult>> {

                console.log("=== Running regression tests...");

                const results: IRegressionTestResult[] = [];

                for (const testEntry of regressions) {

                    console.log("=== Running regression test: " + testEntry.testName);

                    try {

                        await testEntry.test();

                        results.push({
                            testName: testEntry.testName,
                            result: 'pass'
                        });

                    } catch (e) {
                        console.error(`Failed to run regression test: ${testEntry.testName}`, e);
                        results.push({
                            testName: testEntry.testName,
                            result: 'fail',
                            err: e
                        });
                    }

                }

                console.log("=== Running regression tests...done");

                return results;

            }

            function doReport(results: ReadonlyArray<IRegressionTestResult>): RegressionResult {

                const nrPass = results.filter(current => current.result === 'pass').length;
                const nrFail = results.filter(current => current.result === 'fail').length;
                const nrTests = results.length;

                const accuracy = Percentages.calculate(nrPass, nrTests);

                console.log("========");

                for(const result of results) {
                    console.log(Strings.rpad(result.testName, ' ', 25) + " : " + result.result);
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
