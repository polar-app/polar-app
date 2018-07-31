import {WindowReference} from './WindowReference';
import {GetParentWindowRequest} from './ipc/GetParentWindowRequest';
import {Objects} from '../../util/Objects';

export class DialogWindowReference extends WindowReference {


    public static create(obj: any) {
        return Objects.createInstance(DialogWindowReference.prototype, obj);
    }


}
