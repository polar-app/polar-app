import {TextHighlight} from '../TextHighlight';
import {AreaHighlight} from '../AreaHighlight';
import {Flashcard} from '../Flashcard';
import {Files} from '../../util/Files';
import {WriteStream} from 'fs';
import {Preconditions} from '../../Preconditions';
import {AnnotationHolder} from '../AnnotationHolder';

/**
 * Exporter provides a mechanism to write data from the internal Polar JSON
 * object schema to an external source. This includes writing to a file, the
 * clipboard, perhaps Twitter, email, etc.
 *
 * The exporter takes a ExportFormat (html, markdown, etc) and a target.
 *
 *
 */
export class Exporter {

    public static async export(): Promise<void> {

        // create the writer (file, clipboard, etc)

        // create the converter (markdown, html, etc)

        // for each exporter, convert it, and write to the writer,

        // if an exception happens, terminate,

        // otherwise close on termination.

    }

}

/**
 *
 */
export interface ExportConverter {

    readonly id: string;

    init(writer: Writable): Promise<void>;

    convert(writer: Writable, exportable: AnnotationHolder): Promise<void>;

    close(writer: Writable, err?: Error): Promise<void>;

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
export interface ExportWriter extends Writable {

    init(): Promise<void>;

    write(data: string): Promise<void>;

    /**
     * Close the exporter.  Pass err if any error was encountered while writing
     * as we might wish to abort the export if an error was encountered but
     * still release resources.
     *
     * @param err
     */
    close(err?: Error): Promise<void>;

}

/**
 * A supplier that provides an exportable when called. We use a supplier to
 * avoid having to keep everything in memory during an export.
 */
export type ExportableSupplier = () => Promise<AnnotationHolder>;

export type ExportFormat = 'html' | 'markdown' | 'json';
