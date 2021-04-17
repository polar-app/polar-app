import {MarkdownExporter} from './MarkdownExporter';
import {JSONExporter} from './JSONExporter';
import {AnnotationHolders} from 'polar-shared/src/metadata/AnnotationHolders';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {BlobWriter} from "./writers/BlobWriter";
import {FileSavers} from "polar-file-saver/src/FileSavers";
import {AnnotationHolder} from "polar-shared/src/metadata/AnnotationHolder";
import {
    ReadableBinaryDatastore,
    ReadableBinaryDatastoreProvider
} from "polar-shared/src/datastore/IDatastore";
import {Analytics} from '../../analytics/Analytics';

/**
 * Exporter provides a mechanism to write data from the internal Polar JSON
 * object schema to an external source. This includes writing to a file, the
 * clipboard, perhaps Twitter, email, etc.
 *
 * The exporter takes a ExportFormat (html, markdown, etc) and a target.
 *
 */
export class Exporters {

    public static async doExportFromDocMeta(datastoreProvider: ReadableBinaryDatastoreProvider,
                                            format: ExportFormat,
                                            docMeta: IDocMeta): Promise<void> {

        const annotations = AnnotationHolders.fromDocMeta(docMeta);

        await this.doExportForAnnotations(datastoreProvider, annotations, format);
    }

    public static async doExportForAnnotations(datastoreProvider: ReadableBinaryDatastoreProvider,
                                               annotations: ReadonlyArray<AnnotationHolder>,
                                               format: ExportFormat) {

        const createType = () => {
            switch (format) {
                case 'markdown':
                    return "text/markdown;charset=utf-8";

                case 'json':
                    return "application/json;charset=utf-8";

                case 'html':
                    throw new Error("not supported yet");
            }
        };

        const createExt = () => {
            switch (format) {
                case 'markdown':
                    return "md";

                case 'json':
                    return "json";

                case 'html':
                    throw new Error("not supported yet");
            }
        };

        const type = createType();

        const writer = new BlobWriter();

        const datastore = datastoreProvider();

        await this.doExport(writer, datastore, format, annotations);

        const blob = writer.toBlob(type);
        const ext = createExt();
        const ts = new Date().getTime();
        const filename = `annotations-${ts}.${ext}`;

        FileSavers.saveAs(blob, filename);

        Analytics.event2('doc-annotationsExported', { format });
    }

    /**
     * Main export interface.
     */
    public static async doExport(writer: Writer,
                                 datastore: ReadableBinaryDatastore,
                                 format: ExportFormat,
                                 annotations: ReadonlyArray<AnnotationHolder>) {

        await writer.init();

        // create the exporter (markdown, html, etc)
        const exporter = this.create(format);

        await exporter.init(writer, datastore);

        annotations = [...annotations]
            .sort((a, b) => a.original.created.localeCompare(b.original.created));

        for (const annotation of annotations) {
            await exporter.write(annotation);
        }

        await exporter.close();


    }

    private static create(format: ExportFormat) {

        switch (format) {

            case 'markdown':
                return new MarkdownExporter();

            case 'json':
                return new JSONExporter();

            case 'html':
                throw new Error("not supported yet");

        }

    }

}

/**
 *
 */
export interface Exporter {

    readonly id: string;

    init(writer: Writable, datastore: ReadableBinaryDatastore): Promise<void>;

    write(exportable: AnnotationHolder): Promise<void>;

    close(err?: Error): Promise<void>;

}

export interface Writable {

    write(data: string): Promise<void>;

}

/**
 * Handles writing data to a given output channel.  This could be a file,
 * socket, stream, clipboard, etc.
 *
 * The caller must call init() , then any writes, then endExport().
 *
 * This way if the exporter is something like a clipboard , or something
 * non-streaming then it can buffer the data and send on endExport but if it's
 * streaming then we can just flush on each write then handle releasing
 * resources on endExport.
 *
 */
export interface Writer extends Writable {

    init(): Promise<void>;

    write(data: string): Promise<void>;

    /**
     * Close the exporter.  Pass err if any error was encountered while writing
     * as we might wish to abort the export if an error was encountered but
     * still release resources.
     */
    close(err?: Error): Promise<void>;

}

/**
 * A supplier that provides an exportable when called. We use a supplier to
 * avoid having to keep everything in memory during an export.
 */
export type ExportableSupplier = () => Promise<ReadonlyArray<AnnotationHolder>>;

export type ExportFormat = 'html' | 'markdown' | 'json';
