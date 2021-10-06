import {Percentages} from "./Percentages";
import {ErrorType} from "./Errors";
import {StringBuffer} from "./StringBuffer";
import {TextGrid} from "./TextGrid";
import {ISODateTimeStrings} from "../metadata/ISODateTimeStrings";

/**
 * A regression framework for running tests that return boolean and we can then
 * print a matrix and overall accuracy report.
 */

export namespace RegressionEngines {

    export type ResultType = string | number | boolean;

    /**
     * pass: When we have a known good result we pass.
     *
     * fail: When we have a known good failure we fail.
     *
     * unknown: The answer is neither pass nor fail and needs to be classified.
     */
    export type ResultStatus = 'pass' | 'fail' | 'unknown';

    export interface IRegressionTestResultPass<R extends ResultType> {

        /**
         * The status of this regression result ... pass or fail.
         */
        readonly status: ResultStatus;

        /**
         * The actual value.
         */
        readonly actual: R;

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

    /**
     * Multi-line report string intended for human consumption.
     */
    export type ReportStr = string;

    export type IRegressionTestResultExecuted<R extends ResultType, E>
        = (IRegressionTestResultPass<R> & IRegressionTestName) |
        (IRegressionTestResultError<E> & IRegressionTestName) |
        (IRegressionTestResultError<ErrorType> & IRegressionTestName);

    export type RegressionSummary = Readonly<{[key: string]: number}>

    /**
     * A summarizer to the report function to include counts of features in the regression metadtaa.
     */
    export type RegressionSummarizer<R extends ResultType, E> = (results: ReadonlyArray<IRegressionTestResultExecuted<R, E>>) => RegressionSummary;

    export interface RegressionExecResult<R extends ResultType, E> {
        readonly nrPass: number;
        readonly nrFail: number;
        readonly accuracy: number;

        /**
         * Create a report using the keys from the metadata we have.
         */
        readonly createReport: (keys: ReadonlyArray<string>, summarizer?: RegressionSummarizer<R, E>) => ReportStr

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
         * Limit the number of regressions to execute.
         */
        readonly limit: (max: number) => void;

        /**
         * Execute the regression engine with all registered tests.
         */
        readonly exec: () => Promise<RegressionExecResult<R, E>>;

    }

    export interface ICreateOpts {

        /**
         * Just a high level description of this regression which, along with
         * the config, explain what this regression enables.
         */
        readonly description?: string;

        /**
         * The configuration for this regression used for documentation in the report.
         */
        readonly config?: any;
    }

    /**
     * Specify the error type using E which should probably be ErrorType but
     * could also be a code.  Normally, both ErrorType and a list of codes is
     * probably best.
     */
    export function create<R extends ResultType, E>(opts: ICreateOpts = {}): IRegressionEngine<R, E> {

        interface IRegressionTestEntry {
            readonly testName: string;
            readonly test: RegressionTest<R, E>;
        }

        let regressions: IRegressionTestEntry[] = [];

        function register(testName: string, test: RegressionTest<R, E>) {
            regressions.push({testName, test});
        }

        function xregister(testName: string, test: RegressionTest<R, E>) {
            // noop
        }

        function limit(max: number) {
            regressions = regressions.slice(0, max);
        }

        async function exec() {

            async function doTests(): Promise<ReadonlyArray<IRegressionTestResultExecuted<R, E>>> {

                console.log("=== Running regression tests...");

                const results: IRegressionTestResultExecuted<R, E>[] = [];

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

            function doReport(results: ReadonlyArray<IRegressionTestResultExecuted<R, E>>): RegressionExecResult<R, E> {

                const nrPass = results.filter(current => current.status === 'pass').length;
                const nrUnknown = results.filter(current => current.status === 'unknown').length;
                const nrFail = results.filter(current => current.status === 'fail').length;
                const nrTests = results.length;

                const accuracy = Percentages.calculate(nrPass, nrTests);

                function createReport(keys: ReadonlyArray<string>, summarizer?: RegressionSummarizer<R, E>): ReportStr {

                    function createResultGrid() {

                        const headers = ['test name', 'status', ...keys];

                        const textGrid = TextGrid.create(headers.length);

                        textGrid.headers(...headers);

                        function sortResults(results: ReadonlyArray<IRegressionTestResultExecuted<R, E>>): ReadonlyArray<IRegressionTestResultExecuted<R, E>> {

                            function comparatorByName(a: IRegressionTestResultExecuted<R, E>, b: IRegressionTestResultExecuted<R, E>) {
                                return a.testName.localeCompare(b.testName);
                            }

                            function comparatorByStatus(a: IRegressionTestResultExecuted<R, E>, b: IRegressionTestResultExecuted<R, E>) {

                                function toStatusScore(status: ResultStatus) {

                                    switch(status) {

                                        case "unknown":
                                            return 0;
                                        case "fail":
                                            return 1;
                                        case "pass":
                                            return 2;

                                    }

                                }

                                return toStatusScore(a.status) - toStatusScore(b.status);

                            }

                            return [...results]
                                .sort(comparatorByName)
                                .sort(comparatorByStatus)

                        }

                        for(const result of sortResults(results)) {

                            // eslint-disable-next-line camelcase
                            const metadata_fields =
                                keys.map(key => (result.metadata || {})[key] || '')
                                    .map(current => current.toString())

                            const row: ReadonlyArray<string | number | boolean> = [
                                result.testName,
                                result.status,
                                // eslint-disable-next-line camelcase
                                ...metadata_fields
                            ]

                            textGrid.row(...row);

                        }

                        return textGrid.format();
                    }

                    function createSummaryGrid() {

                        const textGrid = TextGrid.create(2);

                        textGrid.headers('name', 'value');

                        textGrid.row('pass', nrPass);
                        textGrid.row('unknown', nrUnknown);
                        textGrid.row('fail', nrFail);
                        textGrid.row('accuracy', accuracy);

                        const summary = summarizer ? summarizer(results) : {};

                        for (const key of Object.keys(summary)) {
                            textGrid.row(key, summary[key]);
                        }

                        return textGrid.format();

                    }

                    const buff = new StringBuffer();

                    const now = ISODateTimeStrings.create();
                    buff.append(`Report generated on: ${now}\n`)

                    if (opts.description) {
                        buff.append(opts.description);
                        buff.append("\n");
                    }

                    if (opts.config) {
                        buff.append(`======================= config: \n`);
                        buff.append(JSON.stringify(opts.config, null, '  '));
                        buff.append("\n");
                    }

                    buff.append(`======================= results: \n`);
                    buff.append(createResultGrid());
                    buff.append("\n");
                    buff.append(`======================= summary: \n`);
                    buff.append(createSummaryGrid());
                    buff.append("\n");

                    return buff.toString();

                }

                return {nrPass, nrFail, accuracy, createReport}

            }

            const results = await doTests();
            return doReport(results);

        }

        return {register, xregister, limit, exec};

    }

}
