import {Firestore} from "../../firebase/Firestore";
import {assert} from "chai";

describe("BlocksPersistence", () => {

    it("should say 'Hello world!'", async () => {
        console.log("hello world");

        const firestore = await Firestore.getInstance();

        console.log(firestore);
        assert.equal(true, true);
    });
});

