import {
    ISODateString,
    ISODateTimeString
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {DOIStr, URLStr} from "polar-shared/src/util/Strings";

export namespace Unpaywall {

    export interface Doc {
        readonly doi: DOIStr;
        // eslint-disable-next-line camelcase
        readonly doi_url: URLStr;
        readonly updated: string;
        readonly title: string;
        readonly publisher: string;
        // eslint-disable-next-line camelcase
        readonly z_authors: ReadonlyArray<Author>;
        // eslint-disable-next-line camelcase
        readonly published_date: ISODateTimeString | ISODateString;
        // eslint-disable-next-line camelcase
        readonly oa_locations: ReadonlyArray<Location>;
    }

    export interface Response extends Doc {
    }

    export interface Author {
        readonly family: string;
        readonly given: string;
    }

    export interface Location {
        readonly updated: ISODateTimeString;
        // eslint-disable-next-line camelcase
        readonly is_best: boolean;
        // eslint-disable-next-line camelcase
        readonly url_for_landing_page: URLStr;
        // eslint-disable-next-line camelcase
        readonly url_for_pdf: URLStr;
    }

}
