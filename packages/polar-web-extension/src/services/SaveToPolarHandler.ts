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
import {ErrorType} from "polar-bookshelf/web/js/ui/data_loader/UseSnapshotSubscriber";

export namespace SaveToPolarHandler {

    import ICapturedEPUB = ExtensionContentCapture.ICapturedEPUB;

    export interface ICapturedPDF {
        readonly url: URLStr;
    }

    export interface SaveToPolarRequestBase {

        /**
         * Needed so that we can determine which tab should have its URL changed.
         */
        readonly tab: number;

    }

    export interface SaveToPolarRequestWithEPUB extends SaveToPolarRequestBase {
        readonly type: 'save-to-polar',
        readonly strategy: 'epub';
        readonly value: ICapturedEPUB;
    }

    export interface SaveToPolarRequestWithPDF extends SaveToPolarRequestBase {
        readonly type: 'save-to-polar',
        readonly strategy: 'pdf';
        readonly value: ICapturedPDF;
    }

    export type SaveToPolarRequest = SaveToPolarRequestWithEPUB | SaveToPolarRequestWithPDF;

    async function doLoadWrittenDoc(tab: number, writtenDoc: WrittenDoc) {

        const url = 'https://app.getpolarized.io/doc/' + writtenDoc.id;

        chrome.tabs.update(tab, {url});

    }

    export function saveToPolarAsPDF(tab: number,
                                     capture: SaveToPolarHandler.ICapturedPDF,
                                     progressListener: WriteFileProgressListener,
                                     errorReporter: (err: ErrorType) => void) {

        // FIXME: make as async function...

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
                await doLoadWrittenDoc(tab, writtenDoc);

            } finally {
                await persistenceLayer.stop();
            }

        }

        doAsync()
            .catch(errorReporter);

    }

    export async function saveToPolarAsEPUB(tab: number,
                                            capture: ICapturedEPUB,
                                            progressListener: WriteFileProgressListener,
                                            errorReporter: (err: ErrorType) => void) {

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
                await doLoadWrittenDoc(tab, writtenDoc);
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

        try {
            await doAsync()
        } catch(e) {
            errorReporter(e);
        }

    }

    export async function handleMessage(message: any, sender: IMessageSender) {

        if (! message.type) {
            console.warn("No message type: ", message)
            return;
        }

        switch (message.type) {

            case 'save-to-polar':

                console.log("Handling save-to-polar message: ", message);

                // eslint-disable-next-line no-case-declarations
                const request = <SaveToPolarRequest> message;

                // eslint-disable-next-line no-case-declarations
                const progressListener = createProgressListener(sender);

                // eslint-disable-next-line no-case-declarations
                const errorReporter = createErrorReporter(sender);

                switch (request.strategy) {

                    case "pdf":
                        saveToPolarAsPDF(request.tab, request.value, progressListener, errorReporter)
                        break;
                    case "epub":
                        await saveToPolarAsEPUB(request.tab, request.value, progressListener, errorReporter)
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
            handleMessage(message, sender)
                .catch(err => {
                    console.error(err);
                });

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

function createErrorReporter(sender: IMessageSender): (err: ErrorType) => void {
    return (err: ErrorType) => {

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
                message: (err as any).message,
                stack: (err as any).stack
            }
        };

        chrome.tabs.sendMessage(sender.tab.id, message)

    }

}
