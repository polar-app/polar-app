import {BrowserWindowReference} from './BrowserWindowReference';
import {Objects} from '../../util/Objects';

export class DialogWindowReference extends BrowserWindowReference {

    public static create(obj: any) {
        return Objects.createInstance(DialogWindowReference.prototype, obj);
    }

}
