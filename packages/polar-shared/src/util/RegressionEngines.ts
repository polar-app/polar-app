import {Percentages} from "./Percentages";
import {Strings} from "./Strings";
import {ErrorType} from "./Errors";
import {StringBuffer} from "./StringBuffer";
import {TextGrid} from "./TextGrid";
import {ISODateTimeStrings} from "../metadata/ISODateTimeStrings";
import {Tags} from "../tags/Tags";

/**
 * A regression framework for running tests that return boolean and we can then
 * print a matrix and overall accuracy report.
 */

export namespace RegressionEngines {

    export type ResultType = string | number | boolean;

    export type ResultStatus = 'pass' | 'fail';

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

    export interface IRegressionWithConfirmation {
        readonly confirmed: boolean;
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
        = (IRegressionTestResultPass<R> & IRegressionTestName & IRegressionWithConfirmation) |
        (IRegressionTestResultError<E> & IRegressionTestName & IRegressionWithConfirmation) |
        (IRegressionTestResultError<ErrorType> & IRegressionTestName & IRegressionWithConfirmation);

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

    /**
     * Confirm that the status of the test is the status we expect.
     */
    export type IConfirmationMap = Readonly<{[testName: string]: ResultStatus}>;

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
        readonly confirmations?: IConfirmationMap;
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

        const confirmations = opts.confirmations || {}

        async function exec() {

            async function doTests(): Promise<ReadonlyArray<IRegressionTestResultExecuted<R, E>>> {

                console.log("=== Running regression tests...");

                const results: IRegressionTestResultExecuted<R, E>[] = [];

                for (const testEntry of regressions) {

                    console.log("=== Running regression test: " + testEntry.testName);

                    function computeConfirmed(status: ResultStatus): boolean {
                        return confirmations[testEntry.testName] === status;
                    }

                    try {

                        const testResult = await testEntry.test();

                        results.push({
                            testName: testEntry.testName,
                            confirmed: computeConfirmed(testResult.status),
                            ...testResult
                        });

                    } catch (e) {
                        console.error(`Failed to run regression test: ${testEntry.testName}`, e);
                        results.push({
                            testName: testEntry.testName,
                            status: 'fail',
                            confirmed: computeConfirmed('fail'),
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

                        const headers = ['test name', 'status', 'confirmed', ...keys];

                        const textGrid = TextGrid.create(headers.length);

                        textGrid.headers(...headers);

                        function sortResults(results: ReadonlyArray<IRegressionTestResultExecuted<R, E>>): ReadonlyArray<IRegressionTestResultExecuted<R, E>> {

                            function comparatorByName(a: IRegressionTestResultExecuted<R, E>, b: IRegressionTestResultExecuted<R, E>) {
                                return a.testName.localeCompare(b.testName);
                            }

                            function comparatorByStatus(a: IRegressionTestResultExecuted<R, E>, b: IRegressionTestResultExecuted<R, E>) {

                                function toStatusScore(status: ResultStatus) {

                                    switch(status) {

                                        case "fail":
                                            return 0;
                                        case "pass":
                                            return 1;

                                    }

                                }

                                return toStatusScore(a.status) - toStatusScore(b.status);

                            }


                            function comparatorByConfirmed(a: IRegressionTestResultExecuted<R, E>, b: IRegressionTestResultExecuted<R, E>) {

                                function toConfirmedScore(confirmed: boolean) {
                                    return confirmed ? 1 : 0;
                                }

                                return toConfirmedScore(a.confirmed) - toConfirmedScore(b.confirmed);

                            }

                            return [...results].sort(comparatorByName)
                                               .sort(comparatorByStatus)
                                               .sort(comparatorByConfirmed);

                        }

                        for(const result of sortResults(results)) {

                            // eslint-disable-next-line camelcase
                            const metadata_fields =
                                keys.map(key => (result.metadata || {})[key] || '')
                                    .map(current => current.toString())

                            const row: ReadonlyArray<string | number | boolean> = [
                                result.testName,
                                result.status,
                                result.confirmed,
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
