import {DialogWindow} from './DialogWindow';

/**
 * A registry of each actual DialogWindow so that we can operate on them once
 * they're created (hide, show, etc)
 */
export class DialogWindowRegistry {

    private backing: { [index: number]: DialogWindow } = {};

    register(dialogWindow: DialogWindow) {
        this.backing[dialogWindow.dialogWindowReference.id] = dialogWindow;
    }

    get(id: number) {
        return this.backing[id];
    }

}
