import { makeObservable, makeAutoObservable, observable, action, computed, isObservable, isObservableProp } from "mobx"
import {assert} from 'chai';

class MyStore {

    @observable public root: string | undefined;

    constructor() {
        this.root = undefined;
        makeObservable(this)
    }

}

describe('MobX', function() {

    function createStore() {
        return new MyStore()
    }

    it("basic", function () {
        const store = createStore();

        assert.isTrue(isObservable(store));
        assert.isTrue(isObservableProp(store, 'root'));

    });

});
