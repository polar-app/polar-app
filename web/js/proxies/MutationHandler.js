const {MutationType} = require("./MutationType");

/**
 *
 */
class MutationHandler {

    constructor(mutationListener) {
        this.mutationListener = mutationListener;
    }

    set(target, property, value, receiver) {
        Reflect.set(...arguments)
        return this.mutationListener.onMutation(MutationType.SET, target, property, value);
    }

    deleteProperty(target, property) {
        Reflect.deleteProperty(...arguments);
        return this.mutationListener.onMutation(MutationType.DELETE, target, property, undefined);
    }

};

module.exports.MutationHandler = MutationHandler;
