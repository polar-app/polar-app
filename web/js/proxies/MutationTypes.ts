import {MutationType} from './MutationType';
import {MutationState} from './MutationState';

export class MutationTypes {

    static toMutationState(mutationType: MutationType) {

        switch(mutationType) {
            case MutationType.INITIAL:
                return MutationState.PRESENT;
            case MutationType.SET:
                return MutationState.PRESENT;
            case MutationType.DELETE:
                return MutationState.ABSENT;

            default:
                throw new Error("Invalid mutationType: " + mutationType);

        }

    }

}
