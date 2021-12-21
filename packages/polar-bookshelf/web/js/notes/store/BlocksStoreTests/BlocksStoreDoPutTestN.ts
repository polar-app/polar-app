import {assert} from "chai";
import {Asserts} from "polar-shared/src/Asserts";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {Block} from "../Block";
import {BlocksStoreTests} from "./BlocksStoreTests";
import {BlockAsserts, BlocksStoreTestUtils} from "./BlocksStoreTestUtils";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IBlockLink} from "polar-blocks/src/blocks/IBlock";
import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";

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

        it('Should update the indexByDocumentID properly when a document block gets added', () => {
            // set up
            const fingerprint = Hashcodes.createRandomID();
            const store = BlocksStoreTestUtils.createStore();
            const documentBlock = BlocksStoreTests.createBasicBlock({
                content: BlocksStoreTestUtils.createDocumentContent({ fingerprint })
            });

            // act
            store.doPut([documentBlock]);

            // assert
            assert.exists(store.indexByDocumentID[fingerprint]);
        });

        it('Should update the tags & reverse backlink indices properly when a block with tags gets added', () => {
            // set up
            const store = BlocksStoreTestUtils.createStore();
            const tags: ReadonlyArray<IBlockLink> = [{ id: 'ref', text: '#taggerino' }]; 
            const block = BlocksStoreTests.createBasicBlock({
                content: { type: 'markdown', data: 'hello', links: tags },
            });

            // act
            store.doPut([block]);

            // assert
            assert.deepEqual(store.reverse.get('ref'), [block.id]);
            assert.deepEqual(store.tagsIndex.get('ref'), [block.id]);
        });

        it('Should update the tags & reverse backlink indices properly when a block with tags get updated', () => {
            // set up
            const store = BlocksStoreTestUtils.createStore();
            const tags: ReadonlyArray<IBlockLink> = [
                { id: 'ref', text: '#taggerino' },
                { id: 'ref1', text: '#taggerino1' },
            ];
                
            const block = BlocksStoreTests.createBasicBlock({
                content: { type: 'markdown', data: 'hello', links: tags },
            });
            store.doPut([block]);

            // act
            const newTags: ReadonlyArray<IBlockLink> = [{ id: 'ref', text: '#taggerino' }]; 
            const updatedBlock = BlocksStoreTests.createBasicBlock({
                id: block.id,
                content: { type: 'markdown', data: 'hello', links: newTags },
                mutation: block.mutation + 1,
            });
            store.doPut([updatedBlock]);

            // assert
            assert.deepEqual(store.reverse.get('ref'), [block.id]);
            assert.deepEqual(store.tagsIndex.get('ref'), [block.id]);
            assert.deepEqual(store.reverse.get('ref1'), []);
            assert.deepEqual(store.tagsIndex.get('ref1'), []);
        });

        it('Should process annotation blocks & inherit the tags of their ownning document block when updating the tags index', () => {
            // set up
            const store = BlocksStoreTestUtils.createStore();
            const documentTags: ReadonlyArray<IBlockLink> = [
                { id: 'ref', text: '#taggerino' },
            ];
            const documentBlock = BlocksStoreTests.createBasicBlock({
                content: BlocksStoreTestUtils.createDocumentContent({}, documentTags),
            });
            const annotationBlock = BlocksStoreTests.createBasicBlock({
                root: documentBlock.id,
                parent: documentBlock.id,
                parents: [documentBlock.id],
                content: BlocksStoreTestUtils.createTextHighlightContent(),
            });
            store.doPut([documentBlock]);

            // act
            store.doPut([annotationBlock]);


            // assert
            assert.sameMembers(
                [...store.tagsIndex.get('ref')],
                [documentBlock.id, annotationBlock.id]);
        });

        it('Should process document blocks & apply the doucment\'s tags to its first 2 levels of children when updating the tags index (add)', () => {
            // set up
            const store = BlocksStoreTestUtils.createStore();
            const documentTags: ReadonlyArray<IBlockLink> = [
                { id: 'ref', text: '#taggerino' },
            ];

            const annotationID = Hashcodes.createRandomID();
            const documentBlock = BlocksStoreTests.createBasicBlock({
                content: BlocksStoreTestUtils.createDocumentContent({}, documentTags),
                items: PositionalArrays.create([annotationID]),
            });
            const annotationBlock = BlocksStoreTests.createBasicBlock({
                id: annotationID,
                root: documentBlock.id,
                parent: documentBlock.id,
                parents: [documentBlock.id],
                content: BlocksStoreTestUtils.createTextHighlightContent(),
            });
            store.doPut([annotationBlock]);

            // act
            store.doPut([documentBlock]);


            // assert
            assert.sameMembers(
                [...store.tagsIndex.get('ref')],
                [documentBlock.id, annotationBlock.id]);
        });

        it('Should process document blocks & apply the doucment\'s tags to its first 2 levels of children when updating the tags index (update) fuck', () => {
            // set up
            const store = BlocksStoreTestUtils.createStore();
            const documentTags: ReadonlyArray<IBlockLink> = [
                { id: 'ref', text: '#taggerino' },
            ];

            const annotationID = Hashcodes.createRandomID();
            const documentBlock = BlocksStoreTests.createBasicBlock({
                id: 'wtf',
                content: BlocksStoreTestUtils.createDocumentContent({}, documentTags),
                items: PositionalArrays.create([annotationID]),
            });
            const annotationBlock = BlocksStoreTests.createBasicBlock({
                id: annotationID,
                root: documentBlock.id,
                parent: documentBlock.id,
                parents: [documentBlock.id],
                content: BlocksStoreTestUtils.createTextHighlightContent(),
            });
            store.doPut([documentBlock]);
            store.doPut([annotationBlock]);

            // act
            const newDocumentTags: ReadonlyArray<IBlockLink> = [
                { id: 'ref1', text: '#taggerino1' },
            ];
            const updatedDocumentBlock = BlocksStoreTests.createBasicBlock({
                id: documentBlock.id,
                content: BlocksStoreTestUtils.createDocumentContent({}, newDocumentTags),
                items: PositionalArrays.create([annotationID]),
                mutation: documentBlock.mutation + 1,
            });
            store.doPut([updatedDocumentBlock]);



            // assert
            assert.sameMembers(
                [...store.tagsIndex.get('ref')],
                []);

            assert.sameMembers(
                [...store.tagsIndex.get('ref1')],
                [documentBlock.id, annotationBlock.id]);
        });
    });
});
