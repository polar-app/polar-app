import {MockDatastore} from "./MockDatastore";

describe("MockDatastore", function () {
    it("basic", () => {
        const datastore = new MockDatastore();
        console.log(datastore);
    });
})
