import {ESRequests} from "polar-answers/src/ESRequests";
import {UUIDs} from "polar-shared/src/metadata/UUIDs";

(async () => {

    type EsProvider = "elastic.co" | "aws-elasticsearch";

    async function runBenchmark(provider: EsProvider, iterationsCount: number) {

        console.log(`Indexing ${iterationsCount} documents with provider ${provider}...`);

        switch (provider) {
            case "aws-elasticsearch":
                process.env.ES_ENDPOINT = 'https://search-polar-m-elasti-7da1alsug7eb-ark26m65fe3ke5q4xpbl647jfa.us-east-1.es.amazonaws.com';
                process.env.ES_USER = 'admin'
                process.env.ES_PASS = 'IW+,5H7,0B;Zbc$vJg4Q/-6t1Sje_J2H';
                break;
            case "elastic.co":
                // EsSecrets.init() will take care of populating these before the request
                process.env.ES_ENDPOINT = '';
                process.env.ES_USER = '';
                process.env.ES_PASS = '';
                break;
        }

        // Create a unique ES index name for this test iteration
        const tmpIndexName = `test-index-${new Date().getTime().toFixed(0)}`;

        // Capture start time
        const time = new Date().getTime();

        // Index N documents
        for (let i = 0; i <= iterationsCount; i++) {
            const id = UUIDs.create();

            const indexOne = await ESRequests.doPost(`/${tmpIndexName}/_doc/${id}`, {
                test_data_1: 'Lorem',
                test_data_2: 'Ipsum',
            });

            if (!indexOne._id) {
                console.error(indexOne);
                throw new Error(`Failed to index document to ES provider ${provider}`);
            }
            // console.log(`Indexed: ${indexOne._id}`);
        }

        // Delete the index after the benchmark
        await ESRequests.doDelete(`/${tmpIndexName}`);

        const benchmarkTimeInSeconds = (new Date().getTime() - time) / 1000;

        return {benchmarkTimeInSeconds};
    }

    try {
        const providers: EsProvider[] = [
            "aws-elasticsearch",
            "elastic.co",
        ];

        for (let provider of providers) {
            const iterationsCount = 10;
            const {benchmarkTimeInSeconds} = await runBenchmark(provider, iterationsCount);
            console.log(`Time it took to index ${iterationsCount} items with provider ${provider}: ${benchmarkTimeInSeconds} seconds`);
            console.log(`Averaged at ${(benchmarkTimeInSeconds / iterationsCount).toPrecision(2)} seconds per item`)
        }
    } catch (e) {
        console.error(e);
    }
})()
