import {ParentWindowRegistry} from '../ParentWindowRegistry';
import {IPCEvent} from '../../../ipc/handler/IPCEvent';
import {DialogWindowReference} from '../DialogWindowReference';
import {IPCMessage} from '../../../ipc/handler/IPCMessage';
import {AbstractDialogWindowReferenceHandler} from './AbstractDialogWindowReferenceHandler';

export class GetParentWindowHandler extends AbstractDialogWindowReferenceHandler {

    private readonly parentWindowRegistry: ParentWindowRegistry;

    constructor(parentWindowRegistry: ParentWindowRegistry) {
        super();
        this.parentWindowRegistry = parentWindowRegistry;
    }

    protected async handleIPC(event: IPCEvent, dialogWindowReference: DialogWindowReference): Promise<void> {

        let parentWindowReference = this.parentWindowRegistry.get(dialogWindowReference);

        let parentWindowReferenceMessage = new IPCMessage<DialogWindowReference>('parent-window-reference', parentWindowReference);

        event.responsePipe.write(event.message.computeResponseChannel(), parentWindowReferenceMessage)

    }

}

