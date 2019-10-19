import {Resources} from 'polar-content-capture/src/phz/Resources';
import {ResourceEntry} from 'polar-content-capture/src/phz/ResourceEntry';
import {PathStr} from "polar-shared/src/util/Strings";

export interface CompressedReader {

    init(source: PathStr | Blob): Promise<void>;

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
