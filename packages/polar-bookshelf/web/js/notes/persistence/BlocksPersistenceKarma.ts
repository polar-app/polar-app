import {Firestore} from "../../firebase/Firestore";

describe("BlocksPersistence", () => {

    it("should say 'Hello world!'", async () => {
        console.log("hello world");

        const firestore = await Firestore.getInstance();

    });
});

