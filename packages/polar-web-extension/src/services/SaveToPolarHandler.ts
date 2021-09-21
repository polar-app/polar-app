import {Tabs} from "../chrome/Tabs";
import {CapturedContentEPUBGenerator} from "../captured/CapturedContentEPUBGenerator";
import {DatastoreWriter} from "../datastore/DatastoreWriter";
import {URLStr} from "polar-shared/src/util/Strings";
import {URLs} from "polar-shared/src/util/URLs";
import {ArrayBuffers} from "polar-shared/src/util/ArrayBuffers";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {WriteFileProgress, WriteFileProgressListener} from "polar-bookshelf/web/js/datastore/Datastore";
import {ExtensionPersistenceLayers} from "./ExtensionPersistenceLayers";
import {PHZMigrations} from "./PHZMigrations";
import {PHZActiveMigrations} from "./PHZActiveMigrations";
import {ExtensionContentCapture} from "../capture/ExtensionContentCapture";
import WrittenDoc = DatastoreWriter.WrittenDoc;
import IWriteOpts = DatastoreWriter.IWriteOpts;

export namespace SaveToPolarHandler {

    import ICapturedEPUB = ExtensionContentCapture.ICapturedEPUB;

    export interface ICapturedPDF {
        readonly url: URLStr;
    }

    export type SaveToPolarRequest = SaveToPolarRequestWithEPUB | SaveToPolarRequestWithPDF;

    export interface SaveToPolarRequestWithEPUB {
        readonly type: 'save-to-polar',
        readonly strategy: 'epub';
        readonly value: ICapturedEPUB;
    }

    export interface SaveToPolarRequestWithPDF {
        readonly type: 'save-to-polar',
        readonly strategy: 'pdf';
        readonly value: ICapturedPDF;
    }


    async function doLoadWrittenDoc(writtenDoc: WrittenDoc) {

        // TODO/ FIXME: we should just send a message BACK to the sender saying
        // to load a URL.  This would be a lot smarter.
        const url = 'https://app.getpolarized.io/doc/' + writtenDoc.id;
        await Tabs.loadLinkInActiveTab(url);
    }

    function saveToPolarAsPDF(capture: SaveToPolarHandler.ICapturedPDF,
                              progressListener: WriteFileProgressListener,
                              errorReporter: (err: Error) => void) {

        console.log("saveToPolarAsPDF")

        async function doAsync() {
            const blob = await URLs.toBlob(capture.url);
            const basename = URLs.basename(capture.url);

            const persistenceLayer = await ExtensionPersistenceLayers.create();

            try {

                const opts: IWriteOpts = {
                    persistenceLayer,
                    doc: blob,
                    type: 'pdf',
                    basename,
                    url: capture.url,
                    progressListener,
                    webCapture: false
                }

                const writtenDoc = await DatastoreWriter.write(opts)
                await doLoadWrittenDoc(writtenDoc);

            } finally {
                await persistenceLayer.stop();
            }

        }

        doAsync()
            .catch(errorReporter);

    }

    function saveToPolarAsEPUB(capture: ICapturedEPUB,
                               progressListener: WriteFileProgressListener,
                               errorReporter: (err: Error) => void) {

        console.log("saveToPolarAsEPUB")

        async function doAsync() {

            console.log("Generating EPUB...");
            const epub = await CapturedContentEPUBGenerator.generate(capture);
            console.log("Generating EPUB...done");

            const doc = ArrayBuffers.toBlob(epub);

            const fingerprint = Hashcodes.createRandomID();

            const basename = Hashcodes.createRandomID() + '.' + 'epub';

            console.log("Creating persistence layer...");
            const persistenceLayer = await ExtensionPersistenceLayers.create();
            console.log("Creating persistence layer...done");

            // TODO ... Rong... pass the author

            try {

                const opts: IWriteOpts = {
                    persistenceLayer,
                    doc,
                    type: 'epub',
                    title: capture.title,
                    description: capture.description,
                    url: capture.url,
                    basename,
                    fingerprint,
                    nrPages: 1,
                    progressListener,
                    webCapture: true
                }

                console.log("Writing to datastore...");
                const writtenDoc = await DatastoreWriter.write(opts)
                console.log("Writing to datastore...done");

                console.log("Loading written doc..");
                await doLoadWrittenDoc(writtenDoc);
                console.log("Loading written doc..done");

                const migration = PHZActiveMigrations.get();

                if (migration?.url === capture.url) {
                    await PHZMigrations.doMigration(persistenceLayer,
                                                    fingerprint,
                                                    migration);
                    PHZActiveMigrations.clear();
                }

            } finally {
                await persistenceLayer.stop();
            }

        }

        doAsync()
            .catch(errorReporter);

    }

    export function handleMessage(message: any, sender: IMessageSender) {

        if (! message.type) {
            console.warn("No message type: ", message)
            return;
        }

        switch (message.type) {

            case 'save-to-polar':

                console.log("Handling save-to-polar message: ", message);

                const request = <SaveToPolarRequest> message;

                const progressListener = createProgressListener(sender);
                const errorReporter = createErrorReporter(sender);

                switch (request.strategy) {

                    case "pdf":
                        saveToPolarAsPDF(request.value, progressListener, errorReporter)
                        break;
                    case "epub":
                        saveToPolarAsEPUB(request.value, progressListener, errorReporter)
                        break;
                    default:
                        console.warn("Unable to handle request strategy: ", request);
                        break;

                }

                break;
            default:
                console.warn("Unknown message type: ", message)
                break;

        }

    }

    export function register() {

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            handleMessage(message, sender);
        });

    }

}

interface ITab {
    id?: number;
}

interface IMessageSender {
    tab?: ITab
}

function createProgressListener(sender: IMessageSender): WriteFileProgressListener {

    return (progress: WriteFileProgress) => {

        if (! sender.tab || ! sender.tab.id) {
            console.warn("Sender is not a tab (not sending progress).");
            return;
        }

        const message = {
            type: 'progress',
            value: progress
        };

        chrome.tabs.sendMessage(sender.tab.id, message)

    }

}

export interface IError {
    readonly message: string;
    readonly stack?: string;
}

function createErrorReporter(sender: IMessageSender): (err: Error) => void {
    return (err: Error) => {

        // make sure to always report it to the console in the background tab
        // so that we have the error there too.
        console.error("Caught error: ", err);

        if (! sender.tab || ! sender.tab.id) {
            console.warn("Sender is not a tab (not sending progress).");
            return;
        }

        const message = {
            type: 'error',
            value: {
                message: err.message,
                stack: err.stack
            }
        };

        chrome.tabs.sendMessage(sender.tab.id, message)

    }

}
