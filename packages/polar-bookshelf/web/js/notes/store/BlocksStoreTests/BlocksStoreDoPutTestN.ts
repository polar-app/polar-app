import {assert} from "chai";
import {Asserts} from "polar-shared/src/Asserts";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {Block} from "../Block";
import {BlocksStoreTests} from "./BlocksStoreTests";
import {BlockAsserts, BlocksStoreTestUtils} from "./BlocksStoreTestUtils";

describe('BlocksStore', () => {

    beforeEach(() => {
        TestingTime.freeze()
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    describe('doPut', () => {
        it('Should skip updating if the mutation number of the new block is less than the old one', () => {
            // set up
            const store = BlocksStoreTestUtils.createStore();

            const block = store.getBlockForMutation('102');
            Asserts.assertPresent(block);
            BlockAsserts.assertBlockType('name', block);

            const newBlock = new Block({
                ...block.toJSON(),
                content: { type: 'name', data: 'updated', links: [] },
                mutation: block.mutation - 1
            });

            // act
            store.doPut([newBlock.toJSON()]);
            
            // assert
            const updatedBlock = store.getBlockForMutation('102');
            Asserts.assertPresent(updatedBlock);
            BlockAsserts.assertBlockType('name', updatedBlock);

            assert.equal(updatedBlock.mutation, block.mutation);
            assert.equal(updatedBlock.content.data, block.content.data);
        });

        it('Should update regardless of the mutation number if the `forceUpdate` flag is true', () => {
            // set up
            const store = BlocksStoreTestUtils.createStore();

            const block = store.getBlockForMutation('102');
            Asserts.assertPresent(block);
            BlockAsserts.assertBlockType('name', block);

            const newBlock = new Block({
                ...block.toJSON(),
                content: { type: 'name', data: 'updated', links: [] },
                mutation: block.mutation - 1
            });

            // act
            store.doPut([newBlock.toJSON()], { forceUpdate: true });
            
            // assert
            const updatedBlock = store.getBlockForMutation('102');
            Asserts.assertPresent(updatedBlock);
            BlockAsserts.assertBlockType('name', updatedBlock);

            assert.equal(updatedBlock.mutation, block.mutation - 1);
            assert.equal(updatedBlock.content.data, 'updated');
        });

        it('Should add new blocks to the blocks index', () => {
            // set up
            const store = BlocksStoreTestUtils.createStore();
            const block = BlocksStoreTests.createBasicBlock({
                content: { type: 'markdown', links: [], data: 'hello' },
                root: '102',
                parent: '102',
                parents: ['102'],
            });
            
            // act
            store.doPut([block]);

            // assert
            assert.exists(store.index[block.id]);
        });

        it('Should add named blocks to the named blocks index', () => {
            // set up
            const store = BlocksStoreTestUtils.createStore();
            const nameBlock = BlocksStoreTests.createBasicBlock({
                content: { type: 'name', links: [], data: 'hello' },
            });

            const dateBlock = BlocksStoreTests.createBasicBlock({
                content: { type: 'date', format: 'YYYY-MM-DD', links: [], data: '1988-08-20' },
            });

            const documentTitle = 'potato';
            const documentBlock = BlocksStoreTests.createBasicBlock({
                content: BlocksStoreTestUtils.createDocumentContent({ title: documentTitle }),
            });
            
            // act
            store.doPut([nameBlock, dateBlock, documentBlock]);

            // assert
            assert.exists(store.indexByName[nameBlock.content.data]);
            assert.exists(store.indexByName[dateBlock.content.data]);
            assert.exists(store.indexByName[documentTitle]);
        });

        it('Should update the name index properly when renaming a named block', () => {
            // set up
            const store = BlocksStoreTestUtils.createStore();
            const nameBlock = BlocksStoreTests.createBasicBlock({
                content: { type: 'name', links: [], data: 'foo' },
            });
            store.doPut([nameBlock]);

            // act
            const updatedBlock = BlocksStoreTests.createBasicBlock({
                ...nameBlock,
                content: { type: 'name', links: [], data: 'bar' },
                mutation: nameBlock.mutation + 1,
            });
            store.doPut([updatedBlock]);

            // assert
            assert.exists(store.indexByName[updatedBlock.content.data]);
            assert.notExists(store.indexByName[nameBlock.content.data]);
        });
    });
});
