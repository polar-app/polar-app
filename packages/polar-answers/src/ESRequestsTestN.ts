import {ESRequests} from "./ESRequests";
import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import IElasticSearchResponse = ESRequests.IElasticSearchResponse;

describe("ESRequests", function() {

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

        const url = '/answers_ft_digest_545445733244727031386635397a6645633050336966426f62503932_docs*/_search?allow_no_indices=true';

        const esResponse: IElasticSearchResponse<IAnswerDigestRecord> = await ESRequests.doPost(url, query);

        console.log("response: ", JSON.stringify(esResponse, null, "  "));

    });

    it("result counts... ", async function() {

        const query = {
            "query": {
                "query_string": {
                    "query": "(planet)",
                    "default_field": "text"
                }
            },
            size: 10
        };

        const url = '/answers_ft_digest_545445733244727031386635397a6645633050336966426f62503932_docs*/_search?allow_no_indices=true';

        const esResponse: IElasticSearchResponse<IAnswerDigestRecord> = await ESRequests.doPost(url, query);

        // console.log("response: ", JSON.stringify(esResponse, null, "  "));

        console.log("total hits: " + esResponse.hits.total.value);

    });


})

