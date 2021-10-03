import {Percentages} from "./Percentages";
import {Strings} from "./Strings";
import {ErrorType} from "./Errors";
import {StringBuffer} from "./StringBuffer";
import {TextGrid} from "polar-bookshelf/web/js/util/TextGrid";
import {ISODateTimeStrings} from "../metadata/ISODateTimeStrings";

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
                const nrFail = results.filter(current => current.status === 'fail').length;
                const nrTests = results.length;

                const accuracy = Percentages.calculate(nrPass, nrTests);

                function createReport(keys: ReadonlyArray<string>, summarizer?: RegressionSummarizer<R, E>): ReportStr {

                    function createResultGrid() {

                        const nrColumns =
                            // we need two core columns for the name and the status
                            2 +
                            // we also need all the metadata columns
                            keys.length;

                        const textGrid = TextGrid.create(nrColumns);

                        textGrid.headers('test name', 'status', ...keys);

                        for(const result of results) {

                            const row: ReadonlyArray<string | number | boolean> = [
                                result.testName,
                                result.status,
                                ...keys.map(key => (result.metadata || {})[key] || '')
                            ]

                            textGrid.row(...row);

                        }

                        return textGrid.format();
                    }

                    function createSummaryGrid() {

                        const textGrid = TextGrid.create(2);

                        textGrid.headers('name', 'value');

                        textGrid.row('pass', nrPass);
                        textGrid.row('fail', nrFail);
                        textGrid.row('accuracy', accuracy);

                        const summary = summarizer ? summarizer(results) : {};

                        for (const key of Object.keys(summary)) {
                            textGrid.row(key, summary[key]);
                        }

                        return textGrid.format();

                    }

                    const buff = new StringBuffer();

                    buff.append("Report generated on: " + ISODateTimeStrings.create())

                    buff.append(`=======================\n`);
                    buff.append(createResultGrid());

                    buff.append(`=======================\n`);
                    buff.append(createSummaryGrid());

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
