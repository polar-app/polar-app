import {assert} from "chai";
import {FirebaseBrowser, UserIDStr} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import {assertJSON} from "polar-test/src/test/Assertions";
import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";
import {BlocksStoreUndoQueues} from "../store/BlocksStoreUndoQueues";
import {BlocksStoreTests} from "../store/BlocksStoreTests";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {FirestoreBlocksPersistenceWriter} from "./BlocksPersistenceWriters";
import {BlockIDStr, IBlock} from "polar-blocks/src/blocks/IBlock";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import {RepoDocInfoDataObjectIndex} from "../../../../apps/repository/js/RepoDocMetaManager";
import {FirebaseTestingUsers} from "polar-firebase-test/src/firebase/FirebaseTestingUsers";
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
import createBasicBlock = BlocksStoreTests.createBasicBlock;

const ID = Hashcodes.createRandomID();

describe("BlocksPersistence", () => {
    let uid: UserIDStr;
    let docInfoIndex: RepoDocInfoDataObjectIndex;

    beforeEach(async () => {

        TestingTime.freeze();

        const app = FirebaseBrowser.init();

        const auth = app.auth();

        await auth.signInWithEmailAndPassword(FirebaseTestingUsers.FIREBASE_USER, FirebaseTestingUsers.FIREBASE_PASS);

        await FirestoreBlocks.doDelete(ID);

        uid = (await FirebaseBrowser.currentUserID())!;

        docInfoIndex = new RepoDocInfoDataObjectIndex();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    it("no mutations", async () => {

        const firestore = await FirestoreBrowserClient.getInstance();

        await FirestoreBlocksPersistenceWriter.doExec(uid, firestore, docInfoIndex, []);

    });

    it("new document", async () => {

        const firestore = await FirestoreBrowserClient.getInstance();

        const mutation: IBlocksStoreMutation = {
            "id": ID,
            "type": "added",
            "added": {
                "id": ID,
                "nspace": uid,
                "uid": uid,
                "created": "2012-03-02T11:38:50.321Z",
                "updated": "2012-03-02T11:38:50.321Z",
                "root": "100",
                "parent": "100",
                "parents": [
                    "100"
                ],
                "content": {
                    "type": "markdown",
                    "data": "added block",
                    "links": [],
                },
                "items": {
                    "1": "1",
                    "2": "2"
                },
                "mutation": 0
            }
        };

        await FirestoreBlocksPersistenceWriter.doExec(uid, firestore, docInfoIndex, [
            mutation
        ]);

        assertJSON(mutation.added, await FirestoreBlocks.get(mutation.id));

    });

    it("missing document", async () => {
        assert.isUndefined(await FirestoreBlocks.get('0xxxxxxxxx'));
    });

    it("updated block", async () => {

        const firestore = await FirestoreBrowserClient.getInstance();

        const uid = (await FirebaseBrowser.currentUserID())!;

        const before = createBasicBlock<IMarkdownContent>({
            id: ID,
            root: "100",
            parent: "100",
            parents: ["100"],
            uid,
            nspace: uid,
            content: {
                type: 'markdown',
                data: 'updated block',
                links: [],
            },
            items: PositionalArrays.create(['1', '2'])
        });


        const mutation: IBlocksStoreMutation = {
            "id": before.id,
            "type": "added",
            "added": before
        };

        await FirestoreBlocksPersistenceWriter.doExec(uid, firestore, docInfoIndex, [
            mutation
        ]);

        assertJSON(before, await FirestoreBlocks.get(ID));
        const after = createBasicBlock<IMarkdownContent>({
            id: ID,
            root: "100",
            parent: "102",
            parents: ["100", "102"],
            uid,
            nspace: uid,
            content: {
                type: 'markdown',
                data: 'updated block 2',
                links: [],
            },
            items: PositionalArrays.create(['1', '2', '3']),
            mutation: 1
        });

        const mutations = BlocksStoreUndoQueues.computeMutatedBlocks([before], [after]);

        await FirestoreBlocksPersistenceWriter.doExec(uid, firestore, docInfoIndex, mutations);

        const actual = await FirestoreBlocks.get(ID);

        console.log("actual: ", actual);
        console.log("after: ", after);

        assertJSON(actual, after);

    });

    it("updated block with float values for items", async () => {

        const firestore = await FirestoreBrowserClient.getInstance();
        const uid = (await FirebaseBrowser.currentUserID())!;

        const before = createBasicBlock<IMarkdownContent>({
            id: ID,
            root: "100",
            parent: "100",
            parents: ["100"],
            uid,
            nspace: uid,
            content: {
                type: 'markdown',
                data: 'updated block',
                links: [],
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

        await FirestoreBlocksPersistenceWriter.doExec(uid, firestore, docInfoIndex, [
            mutation
        ]);

        const after = createBasicBlock<IMarkdownContent>({
            id: ID,
            root: "100",
            parent: "102",
            parents: ["100", "102"],
            uid,
            nspace: uid,
            content: {
                type: 'markdown',
                data: 'updated block 2',
                links: [],
            },
            items: {
                '1': '0x001',
                '1.5': '0x003',
                '2': '0x002',
            },
            mutation: 1
        });

        const mutations = BlocksStoreUndoQueues.computeMutatedBlocks([before], [after]);

        await FirestoreBlocksPersistenceWriter.doExec(uid, firestore, docInfoIndex, mutations);

        assertJSON(await FirestoreBlocks.get(ID), after);

    });

});

namespace FirestoreBlocks {

    export async function get(id: BlockIDStr): Promise<IBlock | undefined> {

        const firestore = await FirestoreBrowserClient.getInstance();

        const doc = await firestore.collection('block').doc(id).get();

        if (doc.exists) {
            return doc.data() as IBlock;
        }

        return undefined;

    }

    export async function doDelete(id: BlockIDStr) {

        const firestore = await FirestoreBrowserClient.getInstance();

        await firestore.collection('block').doc(id).delete()

    }

}
