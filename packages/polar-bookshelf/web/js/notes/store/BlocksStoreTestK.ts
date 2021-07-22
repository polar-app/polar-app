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
});
