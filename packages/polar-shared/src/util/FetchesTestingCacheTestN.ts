import {FetchesTestingCache} from "./FetchesTestingCache";

describe("FetchesTestingCache", function() {
    it("basic", async () => {
        await FetchesTestingCache._computePath('hello');
    });
})
