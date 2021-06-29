import {assert} from "chai";
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
        it("Should create a selection range properly when shift is true", () => {
            const root = '102';

            store.computeLinearTree('102').forEach(block => store.expanded[block] = true);
            store.setActive('105');
            store.navPrev(root, 'end', {shiftKey: true});
            assert.deepEqual(store.selected, { '105': true });
            store.navPrev(root, 'end', {shiftKey: true});
            assert.deepEqual(store.selected, { '116': true, '105': true });
            store.navPrev(root, 'end', {shiftKey: true});
            store.navPrev(root, 'end', {shiftKey: true});
            assert.deepEqual(store.selected, { '103': true, '104': true, '105': true });
            
        });
    });
    describe('navNext', () => {
        it("Should create a selection range properly when shift is true", () => {
            const root = '102';

            store.computeLinearTree('102').forEach(block => store.expanded[block] = true);
            store.setActive('104');
            store.navNext(root, 'end', {shiftKey: true});
            store.navNext(root, 'end', {shiftKey: true});
            store.navNext(root, 'end', {shiftKey: true});
            
            assert.deepEqual(store.selected, { '104': true, '105': true });
        });
    });
});
