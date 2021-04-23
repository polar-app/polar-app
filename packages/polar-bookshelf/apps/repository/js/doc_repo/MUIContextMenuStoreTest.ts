import {assert} from "chai";
import {isObservable, isObservableProp} from 'mobx';
import { MUIContextMenuStore } from "./MUIContextMenuStore";

describe('MUIContextMenuStore', function() {

    describe("Observability", () => {

        it("MUIContextMenuStore", () => {

            const store = new MUIContextMenuStore();

            assert.isTrue(isObservable(store));
            assert.isTrue(isObservableProp(store, 'active'));

        });

    });

});
