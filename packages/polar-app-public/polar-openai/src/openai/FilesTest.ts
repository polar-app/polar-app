import {Files} from "./Files";

describe("Files", function() {
    xit("basic", async () => {
        await Files.upload([{
            text: "The Brown Trout is the best trout ever."
        }], 'answers')
    });
});
