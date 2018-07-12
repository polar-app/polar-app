const{MutationType} = require("./MutationType");
const{MutationState} = require("./MutationState");

class MutationTypes {

    static toMutationState(mutationType) {

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

module.exports.MutationTypes = MutationTypes;
