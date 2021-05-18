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
import {IMarkdownContent} from "../content/IMarkdownContent";
import {PositionalArrays} from "../store/PositionalArrays";
import {BlocksStoreUndoQueues} from "../store/BlocksStoreUndoQueues";
import {BlocksStoreTests} from "../store/BlocksStoreTests";
import createBasicBlock = BlocksStoreTests.createBasicBlock;
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {TestingTime} from "polar-shared/src/test/TestingTime";

const ID = Hashcodes.createID('0x01');

describe("BlocksPersistence", () => {

    beforeEach(async () => {

        TestingTime.freeze();

        const app = Firebase.init();

        const auth = app.auth();

        await auth.signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

        await FirestoreBlocks.doDelete(ID);

    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    it("no mutations", async () => {

        const firestore = await Firestore.getInstance();

        await FirestoreBlocksPersistenceWriter.doExec(firestore, []);

    });


    it("new document", async () => {

        const firestore = await Firestore.getInstance();

        const mutation: IBlocksStoreMutation = {
            "id": ID,
            "type": "added",
            "added": {
                "id": ID,
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

        assertJSON(mutation.added, await FirestoreBlocks.get(mutation.id));

    });

    it("missing document", async () => {
        assert.isUndefined(await FirestoreBlocks.get('0xxxxxxxxx'));
    });

    it("updated block", async () => {

        const firestore = await Firestore.getInstance();

        const before = createBasicBlock<IMarkdownContent>({
            id: ID,
            root: "100",
            parent: "100",
            parents: ["100"],
            content: {
                type: 'markdown',
                data: 'updated block',
            },
            items: PositionalArrays.create(['1', '2'])
        });


        const mutation: IBlocksStoreMutation = {
            "id": before.id,
            "type": "added",
            "added": before
        };

        await FirestoreBlocksPersistenceWriter.doExec(firestore, [
            mutation
        ]);

        assertJSON(before, await FirestoreBlocks.get(ID));
        const after = createBasicBlock<IMarkdownContent>({
            id: ID,
            root: "100",
            parent: "102",
            parents: ["100", "102"],
            content: {
                type: 'markdown',
                data: 'updated block 2',
            },
            items: PositionalArrays.create(['1', '2', '3']),
            mutation: 1
        });

        const mutations = BlocksStoreUndoQueues.computeMutatedBlocks([before], [after]);

        await FirestoreBlocksPersistenceWriter.doExec(firestore, mutations);

        const actual = await FirestoreBlocks.get(ID);

        console.log("actual: ", actual);
        console.log("after: ", after);

        assertJSON(actual, after);

    });

    it("updated block with float values", async () => {

        const firestore = await Firestore.getInstance();

        const before = createBasicBlock<IMarkdownContent>({
            id: ID,
            root: "100",
            parent: "100",
            parents: ["100"],
            content: {
                type: 'markdown',
                data: 'updated block',
            },
            items: {
                '1': '0x001',
                '2': '0x002',
            }
        });

        const mutation: IBlocksStoreMutation = {
            "id": before.id,
            "type": "added",
            "added": before
        };

        await FirestoreBlocksPersistenceWriter.doExec(firestore, [
            mutation
        ]);

        const after = createBasicBlock<IMarkdownContent>({
            id: ID,
            root: "100",
            parent: "102",
            parents: ["100", "102"],
            content: {
                type: 'markdown',
                data: 'updated block 2',
            },
            items: {
                '1': '0x001',
                '1.5': '0x003',
                '2': '0x002',
            },
            mutation: 1
        });

        const mutations = BlocksStoreUndoQueues.computeMutatedBlocks([before], [after]);

        await FirestoreBlocksPersistenceWriter.doExec(firestore, mutations);

        assertJSON(await FirestoreBlocks.get(ID), after);

    });

});

namespace FirestoreBlocks {

    export async function get(id: BlockIDStr): Promise<IBlock | undefined> {

        const firestore = await Firestore.getInstance();

        const doc = await firestore.collection('block').doc(id).get();

        if (doc.exists) {
            return doc.data() as IBlock;
        }

        return undefined;

    }

    export async function doDelete(id: BlockIDStr) {

        const firestore = await Firestore.getInstance();

        await firestore.collection('block').doc(id).delete()

    }

}
