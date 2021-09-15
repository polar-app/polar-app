/**
 * A regression framework for running tests that return boolean and we can then
 * print a matrix and overall accuracy report.
 */
export namespace RegressionEngines {

    /**
     * A basic regression test will 'pass' as long as it doesn't throw an
     * exception.
     */
    export type RegressionTest = () => Promise<void>;

    export interface IRegressionEngine {

        /**
         * Register a test.
         */
        readonly register: (testName: string, test: RegressionTest) => void;

        /**
         * Execute the regression engine with all registered tests.
         */
        readonly exec: () => Promise<void>;

    }

    export function create(): IRegressionEngine {

        interface IRegressionTestEntry {
            readonly testName: string;
            readonly test: RegressionTest;
        }

        interface IRegressionTestResultPass {
            readonly testName: string;
            readonly result: 'pass';
        }

        interface IRegressionTestResultFail {
            readonly testName: string;
            readonly result: 'fail';
            readonly err: any;
        }

        type IRegressionTestResult = IRegressionTestResultPass | IRegressionTestResultFail;

        const regressions: IRegressionTestEntry[] = [];

        function register(testName: string, test: RegressionTest) {
            regressions.push({testName, test});
        }

        async function exec() {

            async function doTests(): Promise<ReadonlyArray<IRegressionTestResult>> {

                const results: IRegressionTestResult[] = [];

                for (const testEntry of regressions) {

                    try {
                        await testEntry.test();

                        results.push({
                            testName: testEntry.testName,
                            result: 'pass'
                        });

                    } catch (e) {
                        results.push({
                            testName: testEntry.testName,
                            result: 'fail',
                            err: e
                        });
                    }

                }

                return results;

            }

            function doReport(results: ReadonlyArray<IRegressionTestResult>) {

            }

            const results = await doTests();



        }

        return {register, exec};

    }

}
