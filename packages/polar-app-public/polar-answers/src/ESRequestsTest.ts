import {ESRequests} from "./ESRequests";
import {ESShingleWriter} from "./ESShingleWriter";
import IElasticSearchResponse = ESRequests.IElasticSearchResponse;
import IAnswerDigestRecord = ESShingleWriter.IAnswerDigestRecord;

xdescribe("ESRequests", async function() {

    it("basic", async function() {

        const query = {
            "query": {
                "query_string": {
                    "query": "Bigtable",
                    "default_field": "text"
                }
            },
            size: 10
        };

        const url = '/answers_ft_digest_545445733244727031386635397a6645633050336966426f62503932_docs/_search';

        const esResponse: IElasticSearchResponse<IAnswerDigestRecord> = await ESRequests.doPost(url, query);

        console.log("response: ", JSON.stringify(esResponse, null, "  "));

    });

})

