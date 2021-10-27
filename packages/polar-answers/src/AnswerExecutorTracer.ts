import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IAnswerDigestRecordPDF} from "polar-answers-api/src/IAnswerDigestRecordPDF";

export namespace AnswerExecutorTracer {



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

}
