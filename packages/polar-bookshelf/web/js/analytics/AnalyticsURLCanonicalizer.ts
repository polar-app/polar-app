import {PathStr, URLStr} from "polar-shared/src/util/Strings";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";

export class AnalyticsURLCanonicalizer {

    public static canonicalize(path: PathStr) {

        if (path.startsWith('/d/')) {
            return DocPreviewURLs.canonicalize(path);
        }

        return path;

    }

}
