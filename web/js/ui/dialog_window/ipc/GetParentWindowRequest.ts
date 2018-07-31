import {DialogWindowReference} from '../DialogWindowReference';
import {Objects} from '../../../util/Objects';

export class GetParentWindowRequest {

    public readonly dialogWindowReference: DialogWindowReference;

    constructor(dialogWindowReference: DialogWindowReference) {
        this.dialogWindowReference = dialogWindowReference;
    }

    public static create(obj: any): GetParentWindowRequest {
        return Objects.createInstance(GetParentWindowRequest.prototype, obj);
    }

}
