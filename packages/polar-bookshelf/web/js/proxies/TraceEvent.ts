/**
 * Listen to a mutation and we're given a list of names and types.
 */
import {MutationType} from './MutationType';
import {MutationState} from './MutationState';
import {MutationTypes} from './MutationTypes';

export class TraceEvent {

    /**
     * @type {string} The path in the object tree of the object being mutated.
     */
    public path: string;

    /**
     * @type {MutationType} The type of the mutation.
     */
    public mutationType: MutationType;

    /**
     * @type {Object} The object being mutated.
     */
    public target: any;

    /**
     * @type {string} The name of the field in the object.
     */
    public property: string;

    /**
     * @type {Object} The new value of the field or undefined if it's a delete operation.
     */
    public value: any;

    /**
     * @type {Object} The previous value of the field before the operation.
     */
    public previousValue: any;

    /**
     * @type {MutationState} A high level
     */
    public mutationState: MutationState;

    constructor(opts: any) {

        this.path = opts.path;
        this.mutationType = opts.mutationType;
        this.target = opts.target;
        this.property = opts.property;
        this.value = opts.value;
        this.previousValue = opts.previousValue;
        this.mutationState = MutationTypes.toMutationState(this.mutationType);

    }

}
