import {WindowReference} from './WindowReference';
import {ParentWindowReference} from './ParentWindowReference';
import {DialogWindowReference} from './DialogWindowReference';

export class ParentWindowRegistry {

    private backing: { [index: number]: ParentWindowReference } = {};

    register(dialogWindowReference: DialogWindowReference, parentWindowReference: WindowReference) {
        this.backing[dialogWindowReference.id] = parentWindowReference;
    }

    get(dialogWindowReference: DialogWindowReference) {
        return this.backing[dialogWindowReference.id];
    }

}
