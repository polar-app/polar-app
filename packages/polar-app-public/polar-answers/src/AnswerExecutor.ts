import {ESRequests} from "./ESRequests";

export namespace AnswerExecutor {

    export async function exec(question: string) {

        // run this query on the digest ...
        const index = 'answer_digest';

        const response = await ESRequests.doPost(`/${index}/_search`, {
            "query": {
                "query_string": {
                    "query": question,
                    "default_field": "text"
                }
            }
        });

        console.log(JSON.stringify(response, null, "  "));

    }

}
