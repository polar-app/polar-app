import {ESRequests} from "./ESRequests";
import {ESDigester} from "./ESDigester";
import IDigestDocument = ESDigester.IDigestDocument;
import IElasticSearchResponse = ESRequests.IElasticSearchResponse;

describe("ESRequests", async function() {

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

        const esResponse: IElasticSearchResponse<IDigestDocument> = await ESRequests.doPost(url, query);

        console.log("response: ", JSON.stringify(esResponse, null, "  "));

    });

})

