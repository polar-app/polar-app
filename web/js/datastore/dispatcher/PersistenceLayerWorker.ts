import {PersistenceLayer} from '../PersistenceLayer';
import {ElectronPersistenceLayerFactory} from '../ElectronPersistenceLayerFactory';
import {IPCMessage} from '../../ipc/handler/IPCMessage';
import {DocMetaSync} from './DocMetaSync';
import {Logger} from '../../logger/Logger';

const log = Logger.create();
//
declare var process: any;
//
declare var exports: any;
//
// exports = {};
//
process.dlopen = () => {
    throw new Error('Load native module is not safe');
};

        ElectronPersistenceLayerFactory.create();

// class PersistenceLayerWorker {
//
//     private readonly persistenceLayer: PersistenceLayer;
//
//     constructor() {
//         this.persistenceLayer = ElectronPersistenceLayerFactory.create();
//     }
//
//     async sync(docMetaWrite: DocMetaSync) {
//         //await this.persistenceLayer.sync(docMetaWrite.fingerprint, docMetaWrite.docMeta);
//     }
//
// }
//
// let persistenceLayerWorker = new PersistenceLayerWorker();
//
addEventListener('message', (messageEvent) => {

    let ipcMessage: IPCMessage<any> = messageEvent.data;

    if(ipcMessage.type === 'sync') {

        // persistenceLayerWorker.sync(messageEvent.data)
        //     .catch(err => log.error("Unable to write docMeta: ", err))

    } else {
        throw new Error("Unhandled message: " + ipcMessage.type);
    }

});
