import {MutationTypes} from './MutationTypes';
import {MutationType} from './MutationType';
import {MutationState} from './MutationState';

const assert = require('assert');

describe('MutationTypes', function() {

    describe('toMutationState', function() {

        it("basic", function() {
            assert.equal(MutationTypes.toMutationState(MutationType.INITIAL), MutationState.PRESENT);
            assert.equal(MutationTypes.toMutationState(MutationType.SET), MutationState.PRESENT);
            assert.equal(MutationTypes.toMutationState(MutationType.DELETE), MutationState.ABSENT);
        });

    });

});
