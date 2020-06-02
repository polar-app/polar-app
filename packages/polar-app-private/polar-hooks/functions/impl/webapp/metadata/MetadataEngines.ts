import {URLStr} from "polar-shared/src/util/Strings";
import {Rewrites} from "polar-shared-webserver/src/webserver/Rewrites";
import {PathToRegexps, URLPathStr} from "polar-shared/src/url/PathToRegexps";
import {Page} from "./Pages";
import {GroupMetadataEngine} from "./impl/GroupMetadataEngine";
import {DefaultMetadataEngine} from "./impl/DefaultMetadataEngine";
import {GroupsMetadataEngine} from "./impl/GroupsMetadataEngine";
import {GroupHighlightMetadataEngine} from "./impl/GroupHighlightMetadataEngine";

/**
 * Accepts a URL and then returns a handler which allows us to compute metadata which we can
 * add to the page.
 */
export interface MetadataEngine {

    /**
     * Compute metadata for this page.
     */
    compute(url: URLStr): Promise<Page | undefined>;

}

export const DEFAULT_HANDLER: MetadataEngineHandlerRef = {
    source: '/',
    engine: new DefaultMetadataEngine(),
};

export class MetadataEngines {

    public static handlers(): ReadonlyArray<MetadataEngineHandlerRef> {
        return [

            {
                source: '/group/:group',
                engine: new GroupMetadataEngine(),
            },
            {
                source: '/group/:group/docs',
                engine: new GroupMetadataEngine(),
            },
            {
                source: '/groups',
                engine: new GroupsMetadataEngine(),
            },
            {
                source: '/group/:group/highlight/:id',
                engine: new GroupHighlightMetadataEngine()
            },

            DEFAULT_HANDLER

        ];
    }

    public static compute(url: URLStr): MetadataEngineHandlerRef {

        const handlers = this.handlers();

        for (const handler of handlers) {

            // TODO: compute these as cached
            const regex = PathToRegexps.pathToRegexp(handler.source);

            const matches = Rewrites.matchesRegex(regex, url);

            if (matches) {
                return handler;
            }

        }

        return DEFAULT_HANDLER;

    }

}

export interface MetadataEngineHandlerRef {

    readonly source: URLPathStr;
    readonly engine: MetadataEngine;

}

