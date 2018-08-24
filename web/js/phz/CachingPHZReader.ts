import {PHZReader} from './PHZReader';
import {ResourceEntry} from './ResourceEntry';
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class CachingPHZReader {

    public path: string;

    /**
     * The delegate PHZReader that actually performs the IO.
     *
     */
    public delegate?: PHZReader;

    /**
     * The amount of time we should wait after init to close the file.
     */
    public timeout: number;

    /**
     * The number of times the reader has been re-opened.
     */
    public reopened: number = 0;

    constructor(path: string, timeout: number = 60000) {

        this.path = path;
        this.timeout = timeout;

    }

    /**
     * Init must be called to load the entries which we can work with.
     *
     * @return {Promise<void>}
     */
    async init() {

        this.delegate = new PHZReader(this.path);
        await this.delegate!.init();

        setTimeout(async () => {

            await this.close();

        }, this.timeout);

    }

    async getMetadata() {
        await this.openWhenNecessary();
        return await this.delegate!.getMetadata();
    }

    /**
     * Get just the resources from the metadata.
     * @return {Promise<Resources>}
     */
    async getResources() {
        await this.openWhenNecessary();
        return await this.delegate!.getResources();
    }

    /**
     * Read a resource from disk and call the callback with the new content once
     * it's ready for usage.
     *
     */
    async getResource(resourceEntry: ResourceEntry): Promise<Buffer> {
        await this.openWhenNecessary();
        return await this.delegate!.getResource(resourceEntry);
    }

    async openWhenNecessary() {

        if(this.delegate) {
            // we are done.  There is already a delegate we can use.
            return;
        }

        log.info("Caching PHZReader being re-opened: " + this.path);
        ++this.reopened;

        await this.init();

    }

    async close() {

        // copy the delegate so that nothing can see this.delegate as being
        // non-null while we close else we would have a race.
        let delegate = this.delegate;

        this.delegate = undefined;

        await delegate!.close();

    }

}
