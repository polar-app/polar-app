import {MetadataEngine} from "../MetadataEngines";
import {Page} from "../Pages";
import {URLStr} from "polar-shared/src/util/Strings";
import {GroupURLs} from "polar-webapp-links/src/groups/GroupURLs";
import {Groups} from "../../../groups/db/Groups";
import {DEFAULT_IMG} from "./DefaultMetadataEngine";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

/**
 *
 * /group/:group
 *
 * @NeedsI18n
 */
export class GroupMetadataEngine implements MetadataEngine {

    public async compute(url: URLStr): Promise<Page | undefined> {

        const parsedURL = GroupURLs.parse(url);

        const groupName = parsedURL.name;
        const group = await Groups.verifyPublic({groupName}, () => Groups.getByName(groupName));

        // TODO: for now there are no posts here. I'm going to have to fix that in the future.

        // TODO: in the future when we have images for groups detect the size and convert over to summary_large_image

        // TODO: also include metadata about who is subscribe to the group and what they are discussing and maybe top
        // documents?

        return {
            title: group.name || "",
            description: group.description,
            canonical: url,
            card: 'summary',
            image: DEFAULT_IMG
        }

    }

}
