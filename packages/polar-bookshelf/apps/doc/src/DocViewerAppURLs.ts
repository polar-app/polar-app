import {IDStr, URLStr} from "polar-shared/src/util/Strings";

export interface DocViewerAppURL {
    readonly id: IDStr;
}

export class DocViewerAppURLs {

    public static parse(url: URLStr): DocViewerAppURL | undefined {

        const regexp = ".*/doc/([^/?#]+)(#([^#/]+)?)?$";

        const matches = url.match(regexp);

        if (! matches) {
            return undefined;
        }

        return {
            id: matches[1]
        };

    }

}
