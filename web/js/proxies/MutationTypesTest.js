const assert = require('assert');
const{MutationType} = require("./MutationType");
const{MutationTypes} = require("./MutationTypes");
const{MutationState} = require("./MutationState");

describe('MutationTypes', function() {

    describe('toMutationState', function() {

        it("basic", function () {
            assert.equal(MutationTypes.toMutationState(MutationType.INITIAL), MutationState.PRESENT);
            assert.equal(MutationTypes.toMutationState(MutationType.SET), MutationState.PRESENT);
            assert.equal(MutationTypes.toMutationState(MutationType.DELETE), MutationState.ABSENT);
        });

    });

});
