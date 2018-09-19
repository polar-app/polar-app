/**
 *
 */
import {MutationListener} from './MutationListener';
import {MutationType} from './MutationType';

export class MutationHandler {

    private mutationListener: MutationListener;

    constructor(mutationListener: MutationListener) {
        this.mutationListener = mutationListener;
    }

    public set(target: any, property: string, value: any, receiver: any) {
        Reflect.set(target, property, value, receiver);
        return this.mutationListener.onMutation(MutationType.SET, target, property, value);
    }

    public deleteProperty(target: any, property: string) {
        Reflect.deleteProperty(target, property);
        return this.mutationListener.onMutation(MutationType.DELETE, target, property, undefined);
    }

}
