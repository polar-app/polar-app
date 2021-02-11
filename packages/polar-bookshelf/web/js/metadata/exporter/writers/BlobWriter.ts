import {Writer} from '../Exporters';

/**
 * Simple writer that just writes to memory
 */
export class BlobWriter implements Writer {

    private data: string[] = [];

    public async init(): Promise<void> {
        // noop
    }

    public async write(data: string): Promise<void> {
        this.data.push(data);
    }

    public async close(err?: Error): Promise<void> {
        // noop
    }

    /**
     * Return this as a converted blob.
     *
     * Use the given type with the blob.  Should be a contentType:
     *
     * Example: text/plain;charset=utf-8
     */
    public toBlob(type: string): Blob {
        return new Blob(this.data, {type});
    }

}
