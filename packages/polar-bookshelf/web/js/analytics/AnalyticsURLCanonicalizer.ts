import {PathStr, URLStr} from "polar-shared/src/util/Strings";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";
import {DocViewerAppURLs} from "../../../apps/doc/src/DocViewerAppURLs";

export class AnalyticsURLCanonicalizer {

    public static canonicalize(path: PathStr) {

        if (path.startsWith('/d/')) {
            return DocPreviewURLs.canonicalize(path);
        }

        if (path.startsWith('/doc/')) {
            return DocViewerAppURLs.canonicalize(path);
        }

        return path;

    }

}
