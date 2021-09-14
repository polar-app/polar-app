import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {ESRequests} from "./ESRequests";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";

// the max docs we can send to OpenAI is 200 so we should initially fetch like
// 600, which is a 3x overhead, then group them so we can collapse them, and
// then re-score..

/**
 * Executor to execute threading requests.
 */
export namespace ThreadingExecutorUsingMLT {

    export interface IThreadingRequestForContext {

        readonly uid: UserIDStr;

        readonly type: 'context';

        /**
         * The identifiers to query for to compute the significant terms as part
         * of the query.
         */
        readonly identifiers: ReadonlyArray<IDStr>;

    }

    export type IThreadingRequest = IThreadingRequestForContext;

    export async function executeES(request: IThreadingRequest) {

        const {uid} = request;

        const index = ESAnswersIndexNames.createForUserDocs(uid);

        interface ILikeRef {
            readonly _index: string,
            readonly _id: string;
        }

        function toLikeRef(id: IDStr): ILikeRef {
            return {
                _index: index,
                _id: id
            }
        }

        const query = {
            "query": {
                "more_like_this": {
                    "fields": [ "text" ],
                    "like": request.identifiers.map(toLikeRef),
                    // "min_term_freq": 1,
                    // "max_query_terms": 12
                }
            }
        }

        const requestURL = `/${index}/_search`;
        return await ESRequests.doPost(requestURL, query);

    }

    export async function execute(request: IThreadingRequest) {
        return await executeES(request);
    }

}
