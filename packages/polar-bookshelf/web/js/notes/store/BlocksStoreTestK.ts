import {assert} from "chai";
import {Asserts} from "../../../../../polar-app-public/polar-shared/src/Asserts";
import {DOMBlocks} from "../contenteditable/BlockContentEditable";
import {BlocksStore} from "./BlocksStore";
import {createStore} from "./BlocksStoreTestNK";


describe('BlocksStore', () => {
    let store: BlocksStore;

    beforeEach(() => {
        store = createStore();
        const selection = window.getSelection();
        selection?.addRange(new Range());
    });

    describe('navPrev', () => {
        describe('selection', () => {
            it("Should create a selection range properly when shift is true", () => {
                const root = '102';

                store.computeLinearTree('102').forEach(block => store.expanded[block] = true);
                store.setActive('105');
                store.navPrev(root, 'end', {shiftKey: true, autoExpandRoot: true});
                assert.deepEqual(store.selected, { '105': true });
                store.navPrev(root, 'end', {shiftKey: true, autoExpandRoot: true});
                assert.deepEqual(store.selected, { '116': true, '105': true });
                store.navPrev(root, 'end', {shiftKey: true, autoExpandRoot: true});
                store.navPrev(root, 'end', {shiftKey: true, autoExpandRoot: true});
                assert.deepEqual(store.selected, { '103': true, '104': true, '105': true });
                
            });
        });
    });

    describe('navNext', () => {
        describe('selection', () => {
            it("Should work with single blocks that have no siblings", () => {
                const root = '112';

                store.computeLinearTree(root)
                    .forEach(block => store.expanded[block] = true);
                store.setActive(root);
                store.navNext(root, 'end', {shiftKey: true, autoExpandRoot: true});
                
                assert.deepEqual(store.selected, { [root]: true });
            });
            it("Should create a selection range properly when shift is true", () => {
                const root = '102';

                store.computeLinearTree(root)
                    .forEach(block => store.expanded[block] = true);
                store.setActive('104');
                store.navNext(root, 'end', {shiftKey: true, autoExpandRoot: true});
                store.navNext(root, 'end', {shiftKey: true, autoExpandRoot: true});
                store.navNext(root, 'end', {shiftKey: true, autoExpandRoot: true});
                
                assert.deepEqual(store.selected, { '104': true, '105': true });
            });
        });

        describe('block traversal', () => {
            it('should traverse blocks using the dom regardless of the given root', () => {
                const root = '102';
                document.body.innerHTML = `<div id="${DOMBlocks.getBlockHTMLID('118')}" data-id="118"></div><div id="${DOMBlocks.getBlockHTMLID('107')}" data-id="107"></div>`;
                store.computeLinearTree(root)
                    .forEach(block => store.expanded[block] = true);

                store.setActive('118');
                store.navNext(root, 'end', {shiftKey: false, autoExpandRoot: true});

                Asserts.assertPresent(store.active);
                assert.equal(store.active.id, '107');
                assert.equal(store.active.pos, 'end');
            });
        });
    });

    describe('styleSelectedBlocks', () => {
        it('should style selected blocks properly', () => {
            document.body.innerHTML = `<div id="${DOMBlocks.getBlockHTMLID('109')}" contentEditable="true" data-id="109">hello</div><div id="${DOMBlocks.getBlockHTMLID('111')}" contentEditable="true" data-id="111">world</div>`;
            store.selected['109'] = true;

            store.styleSelectedBlocks('bold');

            const block = DOMBlocks.getBlockElement('111');
            Asserts.assertPresent(block);
            Asserts.assertPresent(block.firstChild);
            assert.equal((block.firstChild as HTMLElement).tagName, 'B');
        });
    });
});
