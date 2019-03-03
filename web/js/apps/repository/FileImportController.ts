import {PersistenceLayer} from "../../datastore/PersistenceLayer";
import {ipcRenderer} from "electron";
import {Logger} from '../../logger/Logger';
import {ImportedFile, PDFImporter} from './importers/PDFImporter';
import {ProgressCalculator} from "../../util/ProgressCalculator";
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {IDocInfo} from '../../metadata/DocInfo';
import {Optional} from "../../util/ts/Optional";
import {FilePaths} from "../../util/FilePaths";
import {isPresent} from "../../Preconditions";
import {Toaster} from "../../ui/toaster/Toaster";
import {IProvider} from "../../util/Providers";
import {DeterminateProgressBar} from '../../ui/progress_bar/DeterminateProgressBar';
import {DocLoader} from "../main/doc_loaders/DocLoader";
import {FileRef} from "../../datastore/Datastore";
import {Blackout} from "../../ui/blackout/Blackout";
import {FileImportRequest} from "./FileImportRequest";
import {AddFileRequest} from "./AddFileRequest";
import {AppRuntime} from "../../AppRuntime";

const log = Logger.create();

/**
 * Handles performing imports into the datastore when users select files from
 * the import dialog.
 *
 * @ElectronRendererContext
 */
export class FileImportController {

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    private readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    private readonly pdfImporter: PDFImporter;

    private readonly docLoader: DocLoader;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>,
                updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>) {

        this.persistenceLayerProvider = persistenceLayerProvider;
        this.updatedDocInfoEventDispatcher = updatedDocInfoEventDispatcher;
        this.pdfImporter = new PDFImporter(persistenceLayerProvider);
        this.docLoader = new DocLoader(persistenceLayerProvider);

    }

    public start(): void {

        if (ipcRenderer) {

            ipcRenderer.on('file-import', (event: any, fileImportRequest: FileImportRequest) => {

                this.onFileImportRequest(fileImportRequest)
                    .catch(err => log.error("Unable to import: ", err));

            });

        }

        this.handleBlackout();

        document.body.addEventListener('dragenter', (event) => this.onDragEnterOrOver(event), false);
        document.body.addEventListener('dragover', (event) => this.onDragEnterOrOver(event), false);

        document.body.addEventListener('drop', event => this.onDrop(event));

        log.info("File import controller started");

    }

    private handleBlackout() {

        // https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element

        let depth = 0;

        document.body.addEventListener('dragenter', () => {

            if (depth === 0) {
                Blackout.enable();
            }

            ++depth;

        });

        document.body.addEventListener('dragleave', () => {

            --depth;

            if (depth === 0) {
                Blackout.disable();
            }

        });

    }

    private onDragEnterOrOver(event: DragEvent) {
        event.preventDefault();
    }

    private onDrop(event: DragEvent) {

        event.preventDefault();

        Blackout.disable();

        if (event.dataTransfer) {

            const files: AddFileRequest[] = Array.from(event.dataTransfer.files)
                .filter(file => file.name.endsWith(".pdf"))
                .map(file => {

                    if (file.path) {

                        // On Electron we have the file path directly.

                        return {
                            docPath: file.path,
                            basename: FilePaths.basename(file.path)
                        };

                    } else {

                        // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL

                        return {
                            docPath: URL.createObjectURL(file),
                            basename: file.name,
                        };
                    }

                });

            if (files.length > 0) {

                this.onImportFiles(files)
                    .catch(err => log.error("Unable to import files: ", files, err));

            } else {
                Toaster.error("Unable to upload files.  Only PDF uploads are supported.");
            }

        }

    }

    private async onFileImportRequest(fileImportRequest: FileImportRequest) {

        if (! isPresent(fileImportRequest.files) || fileImportRequest.files.length === 0) {
            // do not attempt an import if no files are given.  This way the
            // progress bar doesn't flash \and then vanish again.
            return;
        }

        await this.onImportFiles(fileImportRequest.files);

    }

    private async onImportFiles(files: AddFileRequest[]) {

        const importedFiles = await this.doImportFiles(files);

        if (importedFiles.length === 0) {
            // nothing to do here...
            return;
        }

        if (AppRuntime.isElectron() && importedFiles.length === 1) {

            // only automatically open the file within Electron as that's the
            // only platform that's really fast enough.

            const importedFile = importedFiles[0];

            if (importedFile.isPresent()) {

                const file = importedFile.get();
                const fingerprint = file.docInfo.fingerprint;
                const path = file.stashFilePath;

                // TODO we should ideally have the hashcode built here.
                const fileRef: FileRef = {
                    name: FilePaths.basename(path)
                };

                // TODO(webapp): DO NOT enable this in the web UI... the upload
                // could take forever.  It might be nice to open a tab showing
                // the upload progress and then load the file once it's
                // uploaded.
                this.docLoader.create({
                    fingerprint,
                    fileRef,
                    newWindow: true
                }).load()
                  .catch(err => log.error("Unable to load doc: ", err));

            }

        } else {
            Toaster.success(`Imported ${files.length} files successfully.`);
        }

    }

    private async doImportFiles(files: AddFileRequest[]): Promise<Array<Optional<ImportedFile>>> {

        const progress = new ProgressCalculator(files.length);

        const result: Array<Optional<ImportedFile>> = [];

        try {

            for (const file of files) {

                try {
                    const importedFile = await this.doImportFile(file);
                    result.push(importedFile);
                } catch (e) {
                    log.error("Failed to import file: " + file, e);
                } finally {
                    progress.incr();

                    DeterminateProgressBar.update(progress.percentage());

                }

            }

            return result;

        } finally {
            // noop
        }

    }

    private async doImportFile(file: AddFileRequest): Promise<Optional<ImportedFile>> {

        log.info("Importing file: " + file);

        const importedFileResult =
            await this.pdfImporter.importFile(file.docPath, file.basename);

        importedFileResult.map(importedFile => {
            this.updatedDocInfoEventDispatcher.dispatchEvent(importedFile.docInfo);
        });

        return importedFileResult;

    }

}

