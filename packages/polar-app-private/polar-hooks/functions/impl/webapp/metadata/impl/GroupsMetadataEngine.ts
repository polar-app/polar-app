import {MetadataEngine} from "../MetadataEngines";
import {Page} from "../Pages";
import {URLStr} from "polar-shared/src/util/Strings";
import {DEFAULT_IMG} from "./DefaultMetadataEngine";

/**
 * /groups
 *
 * @NeedsI18n
 */
export class GroupsMetadataEngine implements MetadataEngine {

    public async compute(url: URLStr): Promise<Page | undefined> {

        return {
            title: "Polar Groups",
            description: "Polar groups allow you to comment, highlight and share your documents and reading with your friends.",
            canonical: url,
            image: DEFAULT_IMG,
            card: 'summary',
        };

    }

}
