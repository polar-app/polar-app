import {WebContents} from "electron";
import {IPCMessage} from '../../ipc/handler/IPCMessage';
import {DialogWindow, DialogWindowOptions} from './DialogWindow';
import {Logger} from '../../logger/Logger';
import {DialogWindowReference} from './DialogWindowReference';
import {ParentWindowRegistry} from './ParentWindowRegistry';
import {ParentWindowReference} from './ParentWindowReference';
import {IPCHandler} from '../../ipc/handler/IPCHandler';
import {GetParentWindowRequest} from './ipc/GetParentWindowRequest';
import {IPCEngine} from '../../ipc/handler/IPCEngine';
import {IPCRegistry} from '../../ipc/handler/IPCRegistry';
import BrowserWindow = Electron.BrowserWindow;
import {IPCEvent} from '../../ipc/handler/IPCEvent';
import {ElectronIPCPipe} from '../../ipc/handler/ElectronIPCPipe';
import {MainReadablePipe} from '../../ipc/pipes/MainReadablePipe';

const log = Logger.create();

const CHANNEL_NAME = 'dialog-window';

/**
 *
 * Service that runs in the main process that responds to requests to create
 * dialog boxes hosting new apps.
 *
 * @MainContext
 */
export class DialogWindowService2 {

    private parentWindowRegistry: ParentWindowRegistry = new ParentWindowRegistry();

    start() {

        let mainReadablePipe = new MainReadablePipe();
        let ipcPipe = new ElectronIPCPipe(mainReadablePipe);

        let ipcRegistry = new IPCRegistry();

        ipcRegistry.register(new GetParentWindowHandler(this.parentWindowRegistry));
        ipcRegistry.register(new CreateHandler(this.parentWindowRegistry));


        let ipcEngine = new IPCEngine(ipcPipe, CHANNEL_NAME, ipcRegistry);

        ipcEngine.start();

    }

}

class CreateHandler extends IPCHandler<DialogWindowOptions> {

    private readonly parentWindowRegistry: ParentWindowRegistry;

    constructor(parentWindowRegistry: ParentWindowRegistry) {
        super();
        this.parentWindowRegistry = parentWindowRegistry;
    }

    protected createValue(ipcMessage: IPCMessage<DialogWindowOptions>): DialogWindowOptions {
        return DialogWindowOptions.create(ipcMessage.value);
    }

    getType(): string {
        return 'create';
    }

    protected handleIPC(event: IPCEvent, dialogWindowOptions: DialogWindowOptions): void {

        DialogWindow.create(dialogWindowOptions)
            .then((dialogWindow: DialogWindow) => {

                let browserWindow = BrowserWindow.fromWebContents(sender);
                let parentWindowReference = new ParentWindowReference(browserWindow.id);

                this.parentWindowRegistry.register(dialogWindow.dialogWindowReference, parentWindowReference);

                this.sendCreated(request, sender, dialogWindow.dialogWindowReference);
            })
            .catch(err => log.error("Could not create dialog window: ", err));

    }

    private sendCreated(createWindowMessage: IPCMessage<DialogWindowOptions>, sender: WebContents, dialogWindowReference: DialogWindowReference) {
        // create a dedicated channel with one possible message for the response.
        let createdWindowMessage = new IPCMessage<DialogWindowReference>('created', dialogWindowReference);
        sender.send(createWindowMessage.computeResponseChannel(), createdWindowMessage);
    }

}


class GetParentWindowHandler extends IPCHandler<GetParentWindowRequest> {

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

    protected handleIPC(event: IPCEvent, getParentWindowRequest: GetParentWindowRequest): void {

        let parentWindowReference = this.parentWindowRegistry.get(getParentWindowRequest.dialogWindowReference);

        let parentWindowReferenceMessage = new IPCMessage<DialogWindowReference>('parent-window-reference', parentWindowReference);

        event.writeablePipe.write(CHANNEL_NAME, parentWindowReferenceMessage)

    }

}

