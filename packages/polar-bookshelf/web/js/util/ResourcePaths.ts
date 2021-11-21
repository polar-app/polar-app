import {URLs} from 'polar-shared/src/util/URLs';
import {URLStr} from "polar-shared/src/util/Strings";

/**
 * Given a relative path, return a full path to a local app resource.
 *
 * Each module has a unique __dirname so with this mechanism we can reliably
 * find an path to a file as if we were in the root of the webapp.
 *
 */
export class ResourcePaths {

    /**
     * Build a full resource URL from a given relative URL path.
     */
    public static resourceURLFromRelativeURL(relativeURL: string): URLStr {

        const computeBase = () => {

            if (typeof window !== 'undefined' && window.location) {
                return URLs.toBase(window.location.href);
            }

            return "http://localhost:8500";

        };

        const base = computeBase();

        return base + relativeURL;

    }

}

export class AppPathException extends Error {

}
