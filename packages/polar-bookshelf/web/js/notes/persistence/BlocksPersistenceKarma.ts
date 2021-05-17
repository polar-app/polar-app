import {Firestore} from "../../firebase/Firestore";
import {assert} from "chai";
import {Firebase} from "../../firebase/Firebase";
import {FIREBASE_PASS, FIREBASE_USER} from "../../firebase/FirebaseTesting";
import {FirestoreBlocksPersistenceWriter} from "./FirestoreBlocksPersistenceWriter";
import {BlockIDStr} from "../store/BlocksStore";
import {IBlock} from "../store/IBlock";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
import {assertJSON} from "../../test/Assertions";

describe("BlocksPersistence", () => {

    beforeEach(async () => {
        const app = Firebase.init();

        const auth = app.auth();

        await auth.signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

    });

    it("no mutations", async () => {

        const firestore = await Firestore.getInstance();

        await FirestoreBlocksPersistenceWriter.doExec(firestore, []);

    });


    it("new document", async () => {

        const firestore = await Firestore.getInstance();

        const mutation: IBlocksStoreMutation = {
            "id": "0x03",
            "type": "added",
            "added": {
                "id": "0x03",
                "nspace": "234",
                "uid": "1234",
                "created": "2012-03-02T11:38:50.321Z",
                "updated": "2012-03-02T11:38:50.321Z",
                "root": "100",
                "parent": "100",
                "parents": [
                    "100"
                ],
                "content": {
                    "type": "markdown",
                    "data": "added block"
                },
                "items": {
                    "1": "1",
                    "2": "2"
                },
                "links": {},
                "mutation": 0
            }
        };

        await FirestoreBlocksPersistenceWriter.doExec(firestore, [
            mutation
        ]);

        assertJSON(mutation.added, await FirestoreBlocks.getBlock(mutation.id));

    });

    it("missing document", async () => {

        assert.isUndefined(await FirestoreBlocks.getBlock('0xxxxxxxxx'));
    });

});

namespace FirestoreBlocks {

    export async function getBlock(id: BlockIDStr): Promise<IBlock | undefined> {

        const firestore = await Firestore.getInstance();

        const doc = await firestore.collection('block').doc(id).get();

        if (doc.exists) {
            return doc.data() as IBlock;
        }

        return undefined;

    }

}
