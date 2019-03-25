import {Resources} from './Resources';
import {ResourceEntry} from './ResourceEntry';

export interface CompressedReader {

    init(path: string): Promise<void>;

    /**
     * Get the metadata about this reader.
     */
    getMetadata(): Promise<any | null>;

    /**
     * Tet the list of resources within this reader.
     */
    getResources(): Promise<Resources>;

    getResource(resourceEntry: ResourceEntry): Promise<Buffer>;

    getResourceAsStream(resourceEntry: ResourceEntry): Promise<NodeJS.ReadableStream>;

    close(): Promise<void>;
}
