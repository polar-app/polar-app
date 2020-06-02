import {IDStr, URLStr} from "polar-shared/src/util/Strings";

export interface PDFAppURL {
    readonly id: IDStr;
}

export class DocViewerAppURLs {

    public static parse(url: URLStr) {

        const regexp = ".*/pdf/([^/?]+)$";

        const matches = url.match(regexp);

        if (! matches) {
            return undefined;
        }

        return {
            id: matches[1]
        };

    }

}
