/**
 * Executor to execute threading requests.
 */
import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {ESRequests} from "./ESRequests";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";
import {ESShingleWriter} from "./ESShingleWriter";

// the max docs we can send to OpenAI is 200 so we should initially fetch like
// 600, which is a 3x overhead, then group them so we can collapse them, and
// then re-score..
export namespace ThreadingExecutor {

    export interface IThreadingRequestForContext {

        readonly uid: UserIDStr;

        readonly type: 'context';

        /**
         * The identifiers to query for to compute the significant terms as part
         * of the query.
         */
        readonly identifiers: ReadonlyArray<IDStr>;

    }

    export interface IThreadingRequestForDoc {

        readonly uid: UserIDStr;

        readonly type: 'doc';

        /**
         * The identifiers to query for to compute the significant terms as part
         * of the query.
         */
        readonly docIDs: ReadonlyArray<IDStr>;

    }

    export type IThreadingRequest = IThreadingRequestForContext | IThreadingRequestForDoc;

    export async function executeES(request: IThreadingRequest) {

        const {uid} = request;

        const index = ESAnswersIndexNames.createForUserDocs(uid);

        function createQuery() {

            switch (request.type) {

                case "context":
                    // return {
                    //     "query_string": {
                    //         "query": request.identifiers.map(current => `id:${current}`).join(" OR "),
                    //         "default_field": "id"
                    //     }
                    // };

                    return {
                        "query": {
                            "terms": { "docID": [ request.identifiers ] }
                        },
                    }

                case "doc":
                    return {
                        "query_string": {
                            "query": request.docIDs.map(current => `docID:${current}`).join(" OR "),
                            "default_field": "docID"
                        }
                    };

            }

        }

        function createAggregations() {
            return {
                "significant_terms_text": {
                    "significant_text": { "field": "text" }
                }
            };
        }

        const query = {
            "size: ": 0, // we only care about aggregation count
            "query": createQuery(),
            "aggregations": createAggregations()
        };

        console.log("FIXME: query: ", JSON.stringify(query, null, '  '));

        const requestURL = `/${index}/_search`;
        return await ESRequests.doPost(requestURL, query);

    }

    export async function execute(request: IThreadingRequest) {
        return await executeES(request);
    }

}
