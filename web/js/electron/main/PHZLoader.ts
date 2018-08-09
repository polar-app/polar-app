import {AppPaths} from '../webresource/AppPaths';
import {WebResource} from '../webresource/WebResource';
import {Preconditions} from '../../Preconditions';

const {Paths} = require("../../util/Paths");
const {Fingerprints} = require("../../util/Fingerprints");

const log = require("../../logger/Logger").create();

/**
 *
 */
export class PHZLoader {

    private readonly cacheRegistry: any;

    constructor(opts: any) {

        Object.assign(this, opts);

        Preconditions.assertNotNull(this.cacheRegistry, "cacheRegistry");

    }

    /**
     * Compute a URL to load a file in the UI a PHZ file and registers it
     * with the CacheRegistry so it can be loaded properly.
     *
     * @param path {string}
     * @return {string}
     */
    async registerForLoad(path: string): Promise<WebResource> {

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

        let queryData = `?file=${encodeURIComponent(cachedRequest.url)}&fingerprint=${fingerprint}&descriptor=${encodeURIComponent(descriptorJSON)}`;
        let appURL = 'file://' + appPath + queryData;

        return WebResource.createURL(appURL);

    }

}
