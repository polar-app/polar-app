import {assert} from "chai";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {Asserts} from "polar-shared/src/Asserts";
import {CursorPositions} from "../contenteditable/CursorPositions";
import {DOMBlocks} from "../contenteditable/DOMBlocks";
import {BlockTextContentUtils} from "../NoteUtils";
import {Block} from "./Block";
import {BlockPredicates} from "./BlockPredicates";
import {BlocksStore} from "./BlocksStore";
import {createStore} from "./BlocksStoreTestNK";
import {IBlocksStore} from "./IBlocksStore";


namespace HTMLBlockUtils {
    export function popuplateHTML(store: IBlocksStore) {
        document.body.innerHTML = "";
        store
            .idsToBlocks(Object.values(store.indexByName))
            .map(createBlockHTML(store))
            .forEach((elem) => document.body.appendChild(elem));
    }

    export const createBlockHTML = (store: IBlocksStore) => (block: Block): HTMLDivElement => {
        const container = document.createElement('div');
        const elem = document.createElement("div");
        elem.setAttribute("contentEditable", "true");
        elem.id = `${DOMBlocks.BLOCK_ID_PREFIX}${block.id}`;
        elem.dataset.id = block.id;
        container.appendChild(elem);
        if (BlockPredicates.isEditableBlock(block)) {
            const text = document.createTextNode(BlockTextContentUtils.getTextContentMarkdown(block.content));
            elem.appendChild(text);
        }

        // Only add the children if the block is expanded
        if (store.isExpanded(block.id)) {
            store
                .idsToBlocks(block.itemsAsArray)
                .map(createBlockHTML(store))
                .forEach((childElem) => container.appendChild(childElem));
        }

        return container;
    };

    export const focusBlock = (store: IBlocksStore, id: BlockIDStr, pos: 'start' | 'end' | number = 'start') => {
        store.setActive(id);
        const activeBlock = DOMBlocks.getBlockElement(id);
        Asserts.assertPresent(activeBlock);
        CursorPositions.jumpToPosition(activeBlock, pos);
    };
}


describe('BlocksStore', () => {
    let store: BlocksStore;

    beforeEach(() => {
        store = createStore();
        const selection = window.getSelection();
        selection?.addRange(new Range());
    });

    describe('navigation', () => {
        describe('navPrev', () => {
            const root = '102';
            let store: BlocksStore;

            beforeEach(() => {
                store = createStore();
            });

            it("Should set the previous block as active properly (with all blocks expanded)", () => {
                store.computeLinearTree(root, { includeInitial: true })
                    .forEach(block => store.expand(block));
                HTMLBlockUtils.popuplateHTML(store);
                HTMLBlockUtils.focusBlock(store, '116');

                store.navPrev(root, {shiftKey: false});
                Asserts.assertPresent(store.active);
                assert.equal(store.active.id, '104');
            });

            it("Should skip over the children of a collapsed blocks", () => {
                store.computeLinearTree(root, { includeInitial: true })
                    .forEach(block => store.expand(block));
                store.collapse('104');
                HTMLBlockUtils.popuplateHTML(store);
                HTMLBlockUtils.focusBlock(store, '105');

                store.navPrev(root, { shiftKey: false });
                Asserts.assertPresent(store.active);
                assert.equal(store.active.id, '104');
            });

            it("Should save & restore the position of the cursor when performing the navigation", () => {
                store.computeLinearTree(root, { includeInitial: true })
                    .forEach(block => store.expand(block));
                HTMLBlockUtils.popuplateHTML(store);
                HTMLBlockUtils.focusBlock(store, '104');

                store.navPrev(root, {shiftKey: false, autoExpandRoot: true, pos: 5});
                Asserts.assertPresent(store.active);
                assert.equal(store.active.id, '103');
                const elem103 = DOMBlocks.getBlockElement(store.active.id);
                Asserts.assertPresent(elem103);
                assert.equal(CursorPositions.computeCurrentOffset(elem103), 5);

                store.navPrev(root, {shiftKey: false, autoExpandRoot: true});
                Asserts.assertPresent(store.active);
                assert.equal(store.active.id, '102');
                const elem102 = DOMBlocks.getBlockElement(store.active.id);
                Asserts.assertPresent(elem102);
                assert.equal(CursorPositions.computeCurrentOffset(elem102), 5);
            });
        });


        describe('navNext', () => {
            const root = '102';
            let store: BlocksStore;

            beforeEach(() => {
                store = createStore();
            });

            it("Should set the next block as active properly (with all blocks expanded)", () => {
                store.computeLinearTree(root, { includeInitial: true })
                    .forEach(block => store.expand(block));
                HTMLBlockUtils.popuplateHTML(store);
                HTMLBlockUtils.focusBlock(store, '116');

                store.navNext(root, { shiftKey: false });
                Asserts.assertPresent(store.active);
                assert.equal(store.active.id, '105');
            });

            it("Should skip over the children of a collapsed blocks", () => {
                store.computeLinearTree(root, {includeInitial: true})
                    .forEach(block => store.expand(block));
                store.collapse('104');

                HTMLBlockUtils.popuplateHTML(store);
                HTMLBlockUtils.focusBlock(store, '104');

                store.navNext(root, { shiftKey: false });
                Asserts.assertPresent(store.active);
                assert.equal(store.active.id, '105');
            });

            it("Should save & restore the position of the cursor properly", () => {
                store.computeLinearTree(root, {includeInitial: true})
                    .forEach(block => store.expand(block));
                store.collapse('104');
                HTMLBlockUtils.popuplateHTML(store);
                HTMLBlockUtils.focusBlock(store, '104', 'end');

                store.navNext(root, { shiftKey: false });
                Asserts.assertPresent(store.active);
                assert.equal(store.active.id, '105');

                // Check the position of the cursor
                const elem105 = DOMBlocks.getBlockElement(store.active.id);
                Asserts.assertPresent(elem105);
                assert.equal(CursorPositions.computeCurrentOffset(elem105), 'end');

                store.expand('105');
                HTMLBlockUtils.popuplateHTML(store);
                HTMLBlockUtils.focusBlock(store, '105', 'end');

                store.navNext(root, { shiftKey: false });
                Asserts.assertPresent(store.active);
                assert.equal(store.active.id, '106');

                // Check the position of the cursor
                const elem106 = DOMBlocks.getBlockElement(store.active.id);
                Asserts.assertPresent(elem106);
                assert.equal(CursorPositions.computeCurrentOffset(elem106), 'end');
            });
        });
    });

    describe('selection (navPrev)', () => {
        it("Should create a selection range properly when shift is true", () => {
            const root = '102';
            store.computeLinearTree(root, {includeInitial: true})
                .forEach(block => store.expanded[block] = true);
            HTMLBlockUtils.popuplateHTML(store);
            HTMLBlockUtils.focusBlock(store, '105', 'end');

            store.navPrev(root, {shiftKey: true, autoExpandRoot: true});
            assert.deepEqual(store.selected, { '105': true });
            store.navPrev(root, {shiftKey: true, autoExpandRoot: true});
            assert.deepEqual(store.selected, { '116': true, '105': true });
            store.navPrev(root, {shiftKey: true, autoExpandRoot: true});
            store.navPrev(root, {shiftKey: true, autoExpandRoot: true});
            assert.deepEqual(store.selected, { '103': true, '104': true, '105': true });
            
        });
    });

    describe('selection (navNext)', () => {
        it("Should work with single blocks that have no siblings", () => {
            const root = '112';
            store.computeLinearTree(root).forEach(block => store.expand(block));

            store.setActive(root);
            store.navNext(root, {shiftKey: true, autoExpandRoot: true});
            
            assert.deepEqual(store.selected, { [root]: true });
        });
        it("Should create a selection range properly when shift is true", () => {
            const root = '102';
            store.computeLinearTree(root, {includeInitial: true})
                .forEach(block => store.expand(block));

            HTMLBlockUtils.popuplateHTML(store);
            HTMLBlockUtils.focusBlock(store, '104', 'end');

            store.navNext(root, {shiftKey: true, autoExpandRoot: true});
            store.navNext(root, {shiftKey: true, autoExpandRoot: true});
            store.navNext(root, {shiftKey: true, autoExpandRoot: true});
            
            assert.deepEqual(store.selected, { '104': true, '105': true });
        });
    });

    describe('styleSelectedBlocks', () => {
        it('should style selected blocks properly', () => {
            store.computeLinearTree('109', {includeInitial: true})
                .forEach(block => store.expand(block));
            store.selected['109'] = true;
            HTMLBlockUtils.popuplateHTML(store);

            store.styleSelectedBlocks('bold');

            const block = DOMBlocks.getBlockElement('111');
            Asserts.assertPresent(block);
            Asserts.assertPresent(block.firstChild);
            assert.equal((block.firstChild as HTMLElement).tagName, 'B');
        });
    });
});
