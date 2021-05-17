import {Firestore} from "../../firebase/Firestore";
import {assert} from "chai";
import {Firebase} from "../../firebase/Firebase";
import {FIREBASE_PASS, FIREBASE_USER} from "../../firebase/FirebaseTesting";

describe("BlocksPersistence", () => {

    it("basic", async () => {

        const app = Firebase.init();

        const auth = app.auth();

        await auth.signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

        const firestore = await Firestore.getInstance();

        console.log(firestore);
        assert.equal(true, true);

    });
});

