import {Preconditions} from '../../../Preconditions';
import {Paths} from '../../../util/Paths';
import {Fingerprints} from '../../../util/Fingerprints';
import {Logger} from '../../../logger/Logger';
import {FileLoader} from './FileLoader';
import {CacheRegistry} from '../../../backend/proxyserver/CacheRegistry';
import {WebResource} from '../../../electron/webresource/WebResource';
import {AppPaths} from '../../../electron/webresource/AppPaths';
import {LoadedFile} from './LoadedFile';

const log = Logger.create();

/**
 *
 */
export class PHZLoader implements FileLoader {

    private readonly cacheRegistry: CacheRegistry;

    constructor(opts: PHZLoaderOptions) {
        this.cacheRegistry = Preconditions.assertNotNull(opts.cacheRegistry);
    }

    async registerForLoad(path: string): Promise<LoadedFile> {
        let filename = Paths.basename(path);

        // FIXME: update main.js to use this loader moving forward...

        // register the phz.  the cache interceptor should do the rest.
        let cachedRequestsHolder = await this.cacheRegistry.registerFile(path);

        log.info("cachedRequestsHolder: " + JSON.stringify(cachedRequestsHolder));

        // get the cache metadata for the primary URL as it will work for the
        // subsequent URLs too.

        let cachedRequest = cachedRequestsHolder.cachedRequests[cachedRequestsHolder.metadata.url];

        console.log("Going to load URL: " + cachedRequest.url);

        let descriptor = cachedRequestsHolder.metadata;
        let descriptorJSON = JSON.stringify(descriptor);

        // we don't need the content represented twice.

        let basename = Paths.basename(path);

        // TODO: this is workaround until we enable zip files with embedded
        // metadata / descriptors
        let fingerprint = Fingerprints.create(basename);

        let appPath = AppPaths.relative('./htmlviewer/index.html');

        let filenameParam = encodeURIComponent(filename);

        let queryData = `?file=${encodeURIComponent(cachedRequest.url)}&fingerprint=${fingerprint}&descriptor=${encodeURIComponent(descriptorJSON)}&filename=${filenameParam}`;
        let appURL = 'file://' + appPath + queryData;

        return {
            webResource: WebResource.createURL(appURL),
            title: descriptor.title
        };

    }

}

export interface PHZLoaderOptions {
    readonly cacheRegistry: CacheRegistry;
}
