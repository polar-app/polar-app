import {MutationType} from './MutationType';

export abstract class MutationListener {

    /**
     * Listen to a mutation and we're given a list of names and types.
     *
     * @param mutationType
     * @param target The object being mutated.
     * @param property The name of the field in the object.
     * @param value The new value of the field or undefined if it's a delete operation.
     * @return True if the mutation should continue.
     */
    public abstract onMutation(mutationType: MutationType,
                               target: any,
                               property: string,
                               value: any | undefined): void;

}
