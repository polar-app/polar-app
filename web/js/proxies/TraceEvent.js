const{MutationTypes} = require("./MutationTypes");

/**
 * Listen to a mutation and we're given a list of names and types.
 */
class TraceEvent {

    constructor(opts) {

        /**
         * @type {string} The path in the object tree of the object being mutated.
         */
        this.path = undefined;

        /**
         * @type {MutationType} The type of the mutation.
         */
        this.mutationType = undefined;

        /**
         * @type {Object} The object being mutated.
         */
        this.target = undefined;

        /**
         * @type {string} The name of the field in the object.
         */
        this.property = undefined;

        /**
         * @type {Object} The new value of the field or undefined if it's a delete operation.
         */
        this.value = undefined;

        /**
         * @type {Object} The previous value of the field before the operation.
         */
        this.previousValue = undefined;


        Object.assign(this, opts);

        /**
         * @type {MutationState} A high level
         */
        this.mutationState = MutationTypes.toMutationState(this.mutationType);

    }

}

module.exports.TraceEvent = TraceEvent;
