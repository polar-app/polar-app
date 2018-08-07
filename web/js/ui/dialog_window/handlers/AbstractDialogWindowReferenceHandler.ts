import {IPCHandler} from '../../../ipc/handler/IPCHandler';
import {DialogWindowReference} from '../DialogWindowReference';
import {IPCMessage} from '../../../ipc/handler/IPCMessage';

export abstract class AbstractDialogWindowReferenceHandler extends IPCHandler<DialogWindowReference>{

    protected createValue(ipcMessage: IPCMessage<any>): DialogWindowReference {
        return DialogWindowReference.create(ipcMessage.value);
    }

}
