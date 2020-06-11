import * as url from "url";

export class DatastoreRequests {

    public static parse<T>(link: string): T {

        const parsedURL = url.parse(link, true);

        if  (! parsedURL.query) {
            throw new Error("No query");
        }

        const paramToStr = (value?: string | string[]): string => {

            if (! value) {
                throw new Error("No param");
            }

            if (typeof value === 'object') {
                return value[0];
            }

            return value;

        };

        const data = paramToStr(parsedURL.query.data);

        return JSON.parse(data);

    }

}
