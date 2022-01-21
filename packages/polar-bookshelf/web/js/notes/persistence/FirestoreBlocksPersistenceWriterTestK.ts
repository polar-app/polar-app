import {assert} from "chai";
import {FirebaseBrowser, UserIDStr} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {assertJSON} from "polar-test/src/test/Assertions";
import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";
import {BlocksStoreUndoQueues} from "../store/BlocksStoreUndoQueues";
import {BlocksStoreTests} from "../store/BlocksStoreTests/BlocksStoreTests";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {BlockIDStr, IBlock} from "polar-blocks/src/blocks/IBlock";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import {RepoDocInfoDataObjectIndex} from "../../../../apps/repository/js/RepoDocMetaManager";
import {FirebaseTestingUsers} from "polar-firebase-test/src/firebase/FirebaseTestingUsers";
import {BlockIDs} from "polar-blocks/src/util/BlockIDs";
import {FirestoreBlocksPersistenceWriter} from "./FirestoreBlocksPersistenceWriter";
import {IBlocksStoreMutation} from "../store/IBlocksStoreMutation";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import createBasicBlock = BlocksStoreTests.createBasicBlock;

const ID = BlockIDs.createRandom();

describe("FirestoreBlocksPersistenceWriter", () => {

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

    it("new root named block", async () => {

        const firestore = await FirestoreBrowserClient.getInstance();

        const name = 'Boulder, Colorado';
        const id = BlockIDs.create(name, uid);

        const before = ISODateTimeStrings.create();
        assert.equal(before, '2012-03-02T11:38:49.321Z')

        await FirestoreBlocksPersistenceWriter.doExec(uid, firestore, docInfoIndex, [
            {
                "id": id,
                "type": "added",
                "added": {
                    "id": id,
                    "nspace": uid,
                    "uid": uid,
                    "created": before,
                    "updated": before,
                    "root": id,
                    "parent": undefined,
                    "parents": [
                    ],
                    "content": {
                        "type": "name",
                        "data": name,
                        "links": [],
                    },
                    "items": {
                    },
                    "mutation": 0
                }
            }
        ]);

        assertJSON(Dictionaries.onlyPresentProperties(await FirestoreBlocks.get(id)), {
            "content": {
                "data": "Boulder, Colorado",
                "links": [],
                "type": "name"
            },
            "created": before,
            "id": "12hrrAcxxRYSpNHRQ2wk",
            "items": {},
            "mutation": 0,
            "nspace": "rgLitBszZKagk0Q5C5hBccYKVMd2",
            "parents": [],
            "root": "12hrrAcxxRYSpNHRQ2wk",
            "uid": "rgLitBszZKagk0Q5C5hBccYKVMd2",
            "updated": before
        });

        TestingTime.forward('1h');

        const after = ISODateTimeStrings.create();

        assert.equal(after, '2012-03-02T12:38:49.321Z')

        await FirestoreBlocksPersistenceWriter.doExec(uid, firestore, docInfoIndex, [
            {
                "id": id,
                "type": "added",
                "added": {
                    "id": id,
                    "nspace": uid,
                    "uid": uid,
                    "created": after,
                    "updated": after,
                    "root": id,
                    "parent": undefined,
                    "parents": [
                    ],
                    "content": {
                        "type": "name",
                        "data": name,
                        "links": [],
                    },
                    "items": {
                    },
                    "mutation": 0
                }
            }
        ]);

        assertJSON(Dictionaries.onlyPresentProperties(await FirestoreBlocks.get(id)), {
            "content": {
                "data": "Boulder, Colorado",
                "links": [],
                "type": "name"
            },
            "created": after,
            "id": "12hrrAcxxRYSpNHRQ2wk",
            "items": {},
            "mutation": 0,
            "nspace": "rgLitBszZKagk0Q5C5hBccYKVMd2",
            "parents": [],
            "root": "12hrrAcxxRYSpNHRQ2wk",
            "uid": "rgLitBszZKagk0Q5C5hBccYKVMd2",
            "updated": after
        });

    });


    it("double create of named block", () => {

        // this can happen if two sessions, of the same user, are offline and
        // then they reconnect.

        // TODO

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
