import {Preconditions} from '../../Preconditions';
import {WebserverConfig} from './WebserverConfig';
import {Hashcodes} from '../../Hashcodes';

const path = require('path');

export class FileRegistry {

    private readonly webserverConfig: WebserverConfig;

    private readonly registry: {[key: string]: string} = {}

    constructor(webserverConfig: WebserverConfig) {

        this.webserverConfig = Preconditions.assertNotNull(webserverConfig);

        /**
         * The registry of hashcodes to the file path it should be served from.
         *
         * @type {{}}
         */
        this.registry = {};

    }

    registerFile(filename: string) {
        let key = Hashcodes.create(filename);
        return this.register(key, filename);
    }

    /**
     * Register a file to be served with the given checksum.  Then return
     * metadata about what we registered including how to fetch the file we
     * registered.
     *
     */
    register(key: string, filename: string) {

        filename = path.resolve(filename);

        let reqPath = "/files/" + key;
        this.registry[key] = filename;

        console.log(`Registered new file at: ${reqPath} to ${filename}`)

        return { key, filename, url: `http://127.0.0.1:${this.webserverConfig.port}${reqPath}` };

    }

    /**
     * Return true if the given hashcode is registered.
     *
     * @param key The key we should fetch.
     */
    hasKey(key: string) {
        return key in this.registry;
    }

    /**
     * Get metadata about the given key.
     *
     */
    get(key: string) {

        if(!this.hasKey(key)) {
            throw new Error("Key not registered: " + key);
        }

        return {
            key,
            filename: this.registry[key]
        }

    }

}
