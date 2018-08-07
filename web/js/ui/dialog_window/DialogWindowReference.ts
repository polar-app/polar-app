import {WindowReference} from './WindowReference';
import {Objects} from '../../util/Objects';

export class DialogWindowReference extends WindowReference {

    public static create(obj: any) {
        return Objects.createInstance(DialogWindowReference.prototype, obj);
    }

}
