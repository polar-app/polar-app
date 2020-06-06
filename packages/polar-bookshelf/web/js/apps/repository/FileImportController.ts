import {PersistenceLayerProvider} from "../../datastore/PersistenceLayer";
import {ipcRenderer, remote} from "electron";
import {Logger} from 'polar-shared/src/logger/Logger';
import {ImportedFile, PDFImporter} from './importers/PDFImporter';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {Optional} from "polar-shared/src/util/ts/Optional";
import {isPresent} from 'polar-shared/src/Preconditions';
import {Toaster} from "../../ui/toaster/Toaster";
import {DeterminateProgressBar} from '../../ui/progress_bar/DeterminateProgressBar';
import {DocLoader} from "../main/doc_loaders/DocLoader";
import {Blackout} from "../../ui/blackout/Blackout";
import {FileImportRequest} from "./FileImportRequest";
import {AddFileRequest} from "./AddFileRequest";
import {AppRuntime} from "../../AppRuntime";
import {AddFileRequests} from "./AddFileRequests";
import {ProgressTracker} from 'polar-shared/src/util/ProgressTracker';
import {AccountUpgrader} from "../../ui/account_upgrade/AccountUpgrader";

const log = Logger.create();

const DISABLED = false;

/**
 * Handles performing imports into the datastore when users select files from
 * the import dialog.
 *
 * @ElectronRendererContext
 */
export class FileImportController {

    private readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    private readonly pdfImporter: PDFImporter;

    private readonly docLoader: DocLoader;

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider,
                updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>) {

        this.updatedDocInfoEventDispatcher = updatedDocInfoEventDispatcher;
        this.pdfImporter = new PDFImporter(persistenceLayerProvider);
        this.docLoader = new DocLoader(persistenceLayerProvider);

    }

    public start(): void {

        if (DISABLED) {
            return;
        }

        if (ipcRenderer) {

            ipcRenderer.on('file-import', (event: any, fileImportRequest: FileImportRequest) => {

                this.onFileImportRequest(fileImportRequest)
                    .catch(err => log.error("Unable to import: ", err));

            });

        }

        this.handleBlackout();
        this.handleDragAndDropFiles();
        this.handleFileUpload();

        log.info("File import controller started");

    }

    private handleDragAndDropFiles() {

        document.body.addEventListener('dragenter', (event) => this.onDragEnterOrOver(event), false);
        document.body.addEventListener('dragover', (event) => this.onDragEnterOrOver(event), false);
        document.body.addEventListener('drop', event => this.onDrop(event));

    }

    private handleFileUpload() {

        const handleFileUploaded = () => {

            log.notice("Handling file upload");

            const target = document.querySelector('#file-upload');

            if (target) {

                const fileUpload = <HTMLInputElement> target;

                if (fileUpload.files !== null) {

                    const addFileRequests = AddFileRequests.computeFromFileList(fileUpload.files);

                    this.handleAddFileRequests(addFileRequests)
                        .catch(err => log.error("Could not add files: ", err));

                } else {
                    console.warn("No files actually uploaded");
                }

            } else {
                log.warn("No file upload input");
            }

        };

        const handleMessage = (event: MessageEvent) => {

            if (event.data.type === 'file-uploaded') {
                handleFileUploaded();
            }

        };

        window.addEventListener("message", event => {

            try {
                handleMessage(event);
            } catch (e) {
                log.error("Unable to handle message: ", e);
            }

        });

    }

    private handleBlackout() {

        // https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element

        let depth = 0;

        document.body.addEventListener('dragenter', (event) => {

            if (! this.isFileTransfer(event)) {
                return;
            }

            if (depth === 0) {
                Blackout.enable();
            }

            ++depth;

        });

        const leaveOrDropHandler = (event: DragEvent) => {

            if (! this.isFileTransfer(event)) {
                return;
            }

            --depth;

            if (depth === 0) {
                Blackout.disable();
            }

        };

        document.body.addEventListener('dragleave', event => leaveOrDropHandler(event));
        document.body.addEventListener('drop', event => leaveOrDropHandler(event));

    }


    private onDragEnterOrOver(event: DragEvent) {

        if (! this.isFileTransfer(event)) {
            return;
        }

        event.preventDefault();
    }

    private onDrop(event: DragEvent) {

        if (! this.isFileTransfer(event)) {
            return;
        }

        event.preventDefault();

        Blackout.disable();

        this.handleDrop(event)
            .catch(err => log.error("Unable to import: ", err));

    }

    private async handleDrop(event: DragEvent) {

        // we have to do three main things here:

        if (event.dataTransfer) {
            const directly = AddFileRequests.computeDirectly(event);
            const recursively = await AddFileRequests.computeRecursively(event);

            const addFileRequests = [...directly, ...recursively.getOrElse([])];

            await this.handleAddFileRequests(addFileRequests);
        }

    }

    private async handleAddFileRequests(addFileRequests: AddFileRequest[]) {

        if (addFileRequests.length > 0) {

            const accountUpgrader = new AccountUpgrader();

            if (await accountUpgrader.upgradeRequired()) {
                accountUpgrader.startUpgrade();
                return;
            }

            try {
                await this.onImportFiles(addFileRequests);
            } catch (e) {
                log.error("Unable to import files: ", addFileRequests, e);
            }

        } else {
            Toaster.error("Unable to upload files.  Only PDF uploads are supported.");
        }

    }

    private async onFileImportRequest(fileImportRequest: FileImportRequest) {

        if (! isPresent(fileImportRequest.files) || fileImportRequest.files.length === 0) {
            // do not attempt an import if no files are given.  This way the
            // progress bar doesn't flash and then vanish again.
            return;
        }

        await this.onImportFiles(fileImportRequest.files);

    }

    private async onImportFiles(files: AddFileRequest[]) {

        this.forceWindowFocus();

        const importedFiles = await this.doImportFiles(files);

        if (importedFiles.length === 0) {
            log.warn("No files given to upload");
            // nothing to do here...
            return;
        }

        // Toaster.info(`Importing ${files.length} file(s) (one moment please).`);

        if (AppRuntime.isElectron() && importedFiles.length === 1) {

            // only automatically open the file within Electron as that's the
            // only platform that's really fast enough after the initial copy

            const importedFile = importedFiles[0];

            if (importedFile.isPresent()) {

                const file = importedFile.get();
                const fingerprint = file.docInfo.fingerprint;

                if (AppRuntime.isElectron()) {

                    // DO NOT enable this in the web UI... the upload could take
                    // forever.  It might be nice to open a tab showing the
                    // upload progress and then load the file once it's
                    // uploaded.

                    this.docLoader.create({
                        fingerprint,
                        backendFileRef: file.backendFileRef,
                        newWindow: true
                    }).load()
                      .catch(err => log.error("FileImportController: Unable to load doc: ", err));

                }

            }

        }


        if (importedFiles.length !== 1) {
            Toaster.success(`Imported ${files.length} file(s) successfully.`);
        }

    }

    private forceWindowFocus() {

        if (remote) {
            remote.getCurrentWindow().focus();
        }

    }

    private async doImportFiles(files: AddFileRequest[]): Promise<Array<Optional<ImportedFile>>> {

        const progressTracker = new ProgressTracker({total: files.length, id: 'import-files'});

        const result: Array<Optional<ImportedFile>> = [];

        try {

            for (const file of files) {

                try {
                    const importedFile = await this.doImportFile(file);
                    log.info("Imported file: ", importedFile);
                    result.push(importedFile);
                } catch (e) {
                    log.error("Failed to import file: ", e, file);
                } finally {
                    DeterminateProgressBar.update(progressTracker.incr());
                }

            }

            return result;

        } finally {
            // noop
        }

    }

    private async doImportFile(file: AddFileRequest): Promise<Optional<ImportedFile>> {

        log.info("Importing file: ", file);

        const importedFileResult =
            await this.pdfImporter.importFile(file.docPath, file.basename);

        importedFileResult.map(importedFile => {
            this.updatedDocInfoEventDispatcher.dispatchEvent(importedFile.docInfo);
        });

        return importedFileResult;

    }

    /**
     * Return true if this is a file transfer event otherwise we need to just
     * ignore it as it could be any other type of drag event within the UI.
     */
    private isFileTransfer(event: DragEvent) {

        if (! event.dataTransfer) {
            return false;
        }

        // https://stackoverflow.com/questions/6848043/how-do-i-detect-a-file-is-being-dragged-rather-than-a-draggable-element-on-my-pa

        if (event.dataTransfer.types) {

            // we need to detect if this is using the files types because
            // we do not have the actual files until the drop is complete.

            if (event.dataTransfer.types.includes('Files') ||
                event.dataTransfer.types.includes('application/x-moz-file')) {

                return true;
            }

        }


        if (! event.dataTransfer.files) {
            return false;
        }

        if (event.dataTransfer.files.length === 0) {
            return false;
        }

        return true;

    }

}

