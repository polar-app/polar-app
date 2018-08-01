import {ElectronIPCEvent} from '../../../ipc/handler/ElectronIPCEvent';
import {ParentWindowRegistry} from '../ParentWindowRegistry';
import {IPCHandler} from '../../../ipc/handler/IPCHandler';
import {DialogWindowReference} from '../DialogWindowReference';
import {IPCMessage} from '../../../ipc/handler/IPCMessage';
import {DialogWindow, DialogWindowOptions} from '../DialogWindow';
import {Logger} from '../../../logger/Logger';

const log = Logger.create();

export class CreateWindowHandler extends IPCHandler<DialogWindowOptions> {

    private readonly parentWindowRegistry: ParentWindowRegistry;

    constructor(parentWindowRegistry: ParentWindowRegistry) {
        super();
        this.parentWindowRegistry = parentWindowRegistry;
    }

    protected createValue(ipcMessage: IPCMessage<DialogWindowOptions>): DialogWindowOptions {
        return DialogWindowOptions.create(ipcMessage.value);
    }

    protected handleIPC(event: ElectronIPCEvent, dialogWindowOptions: DialogWindowOptions): void {

        DialogWindow.create(dialogWindowOptions)
            .then((dialogWindow: DialogWindow) => {

                let parentWindowReference = event.senderWindowReference;
                this.parentWindowRegistry.register(dialogWindow.dialogWindowReference, parentWindowReference);
                this.sendCreated(event, dialogWindow.dialogWindowReference);

            })
            .catch(err => log.error("Could not create dialog window: ", err));

    }

    private sendCreated(event: ElectronIPCEvent, dialogWindowReference: DialogWindowReference) {
        let createdWindowMessage = new IPCMessage<DialogWindowReference>('created', dialogWindowReference);
        event.writeablePipe.write(event.message.computeResponseChannel(), createdWindowMessage);
    }

}

