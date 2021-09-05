import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {ESRequests} from "./ESRequests";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";

// the max docs we can send to OpenAI is 200 so we should initially fetch like
// 600, which is a 3x overhead, then group them so we can collapse them, and
// then re-score..

/**
 * Executor to execute threading requests.
 */
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

                    // TODO: for context we have to jump to OTHER parts of the
                    // same document or different documents.

                    return {
                        "query": {
                            "terms": { "docID": [ request.identifiers ] }
                        },
                    }

                case "doc":

                    // TODO: docs is a bit harder as it reads in ALL the terms
                    // into memory plus we do not have too many docs right now
                    // to compare it to.

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
                    "significant_text": {
                        "size": 100,
                        "field": "text"
                    }
                }
            };
        }

        const query = {
            // "size: ": 0, // we only care about aggregation count
            "size": 0,
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
