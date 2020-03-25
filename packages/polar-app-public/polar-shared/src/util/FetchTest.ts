import {Fetches} from "./Fetch";
import {Streams} from "./Streams";

describe('Fetch', function() {

    it("basic", async function() {

        const response = await Fetches.fetch('http://www.example.com');

        await Streams.toArray(response.body);

    });

});

