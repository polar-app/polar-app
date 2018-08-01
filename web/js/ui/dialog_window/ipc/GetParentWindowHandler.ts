import {ParentWindowRegistry} from '../ParentWindowRegistry';
import {IPCEvent} from '../../../ipc/handler/IPCEvent';
import {IPCHandler} from '../../../ipc/handler/IPCHandler';
import {DialogWindowReference} from '../DialogWindowReference';
import {GetParentWindowRequest} from './GetParentWindowRequest';
import {IPCMessage} from '../../../ipc/handler/IPCMessage';

export class GetParentWindowHandler extends IPCHandler<GetParentWindowRequest> {

    private readonly parentWindowRegistry: ParentWindowRegistry;

    constructor(parentWindowRegistry: ParentWindowRegistry) {
        super();
        this.parentWindowRegistry = parentWindowRegistry;
    }

    protected createValue(ipcMessage: IPCMessage<GetParentWindowRequest>): GetParentWindowRequest {
        return GetParentWindowRequest.create(ipcMessage.value);
    }

    public getType(): string {
        return 'get-parent-window';
    }

    protected handleIPC(event: IPCEvent, request: GetParentWindowRequest): void {

        let parentWindowReference = this.parentWindowRegistry.get(request.dialogWindowReference);

        let parentWindowReferenceMessage = new IPCMessage<DialogWindowReference>('parent-window-reference', parentWindowReference);

        event.writeablePipe.write(event.message.computeResponseChannel(), parentWindowReferenceMessage)

    }

}

