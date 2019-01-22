import {WriteStream} from "fs";
import {Files} from '../../../util/Files';
import {Preconditions} from '../../../Preconditions';
import {ExportWriter} from '../Exporter';

/**
 * Simple writer that just writes to memory
 */
export class BufferExportWriter implements ExportWriter {

    private buffer: string[] = [];

    public async init(): Promise<void> {

    }

    public async write(data: string): Promise<void> {
        this.buffer.push(data);
    }

    public async close(err?: Error): Promise<void> {
    }

    public toString(): string {
        return this.buffer.join("");
    }

}
