import {assert} from "chai";
import {BlocksStore} from "./BlocksStore";
import {createStore} from "./BlocksStoreTestNK";


describe('BlocksStore', () => {
    let store: BlocksStore;

    beforeEach(() => {
        store = createStore();
        store.setRoot('102');
        const selection = window.getSelection();
        selection?.addRange(new Range());
    });

    describe('navPrev', () => {
        it("Should create a selection range properly when shift is true", () => {

            store.computeLinearTree('102').forEach(block => store.expanded[block] = true);
            store.setActive('105');
            store.navPrev('end', {shiftKey: true});
            assert.deepEqual(store.selected, { '105': true });
            store.navPrev('end', {shiftKey: true});
            assert.deepEqual(store.selected, { '116': true, '105': true });
            store.navPrev('end', {shiftKey: true});
            store.navPrev('end', {shiftKey: true});
            assert.deepEqual(store.selected, { '103': true, '104': true, '105': true });
            
        });
    });
    describe('navNext', () => {
        it("Should create a selection range properly when shift is true", () => {

            store.computeLinearTree('102').forEach(block => store.expanded[block] = true);
            store.setActive('104');
            store.navNext('end', {shiftKey: true});
            store.navNext('end', {shiftKey: true});
            store.navNext('end', {shiftKey: true});
            
            assert.deepEqual(store.selected, { '104': true, '105': true });
        });
    });
});
