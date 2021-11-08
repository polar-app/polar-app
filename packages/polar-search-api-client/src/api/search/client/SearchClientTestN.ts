import {SearchClient} from "./SearchClient";


describe('SearchClient', function() {

    it("basic", async function() {
        this.timeout(120000);
        const results = await SearchClient.exec({q: 'bitcoin', target: 'arxiv'});

        console.log(JSON.stringify(results, null, "  "));

    });

});
