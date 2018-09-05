import {BrowserWindowReference} from './BrowserWindowReference';
import {ParentWindowReference} from './ParentWindowReference';
import {DialogWindowReference} from './DialogWindowReference';

export class ParentWindowRegistry {

    private backing: { [index: number]: ParentWindowReference } = {};

    public register(dialogWindowReference: DialogWindowReference, parentWindowReference: BrowserWindowReference) {
        this.backing[dialogWindowReference.id] = parentWindowReference;
    }

    public get(dialogWindowReference: DialogWindowReference) {
        return this.backing[dialogWindowReference.id];
    }

}
