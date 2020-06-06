import {URLStr} from "polar-shared/src/util/Strings";
import {ExternalLink} from "../db/Groups";

export class LinksValidator {

    /**
     * Filter out only valid links
     */
    public static filter(links?: ReadonlyArray<URLStr | ExternalLink>): ReadonlyArray<URLStr | ExternalLink> | undefined {

        if (! links) {
            return links;
        }

        const predicate = (value: string) => {
            return value.startsWith("http:") || value.startsWith("https:");
        };

        return links.filter(link => {

            if (typeof link === 'string') {
                return predicate(link);
            } else {
                return predicate(link.url);
            }

        });

    }

}
