import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IAnswerDigestRecordPDF} from "polar-answers-api/src/IAnswerDigestRecordPDF";
import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {OpenAIAnswersClient} from "./OpenAIAnswersClient";
import {IOpenAIAnswersResponse} from "polar-answers-api/src/IOpenAIAnswersResponse";

export namespace AnswerExecutorTracer {

    import IOpenAIAnswersRequest = OpenAIAnswersClient.IOpenAIAnswersRequest;

    /**
     * Compute the unique Doc IDs for the records so that we can can store them for auditing.
     */
    export function computeUniqueDocIDs(records: ReadonlyArray<IAnswerDigestRecord>) {

        function toDocID(record: IAnswerDigestRecord): string | undefined {

            function isPDFRecord(val: IAnswerDigestRecord): val is IAnswerDigestRecordPDF {
                return (val as any).type === 'pdf';
            }

            if (isPDFRecord(record)) {
                return record.docID;
            }

            return undefined;

        }

        return arrayStream(records)
            .map(current => toDocID(current))
            .filterPresent()
            .unique()
            .collect();

    }

    export interface IAnswerExecutorTrace {

        readonly id: IDStr;

        readonly uid: UserIDStr;

        readonly question: string;

        readonly elasticseach_query: any;

        readonly elasticsearch_url: string;

        /**
         * The records given back from ES.
         */
        // eslint-disable-next-line camelcase
        readonly elasticseach_records: ReadonlyArray<IAnswerDigestRecord>;

        // eslint-disable-next-line camelcase
        readonly openai_request: IOpenAIAnswersRequest;

        // eslint-disable-next-line camelcase
        readonly openai_response: IOpenAIAnswersResponse;

    }

}
