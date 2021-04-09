import {MetadataEngine} from "../MetadataEngines";
import {Page} from "../Pages";
import {URLStr} from "polar-shared/src/util/Strings";
import {ImageObjects} from "../jsonld/ImageObject";

export const DEFAULT_IMG = ImageObjects.create({
    url: 'https://getpolarized.io/assets/logo/icon.png',
    width: 512,
    height: 512
});

/**
 * Doesn't do anything special other than provide the current / default behavior.
 */
export class DefaultMetadataEngine implements MetadataEngine {

    public async compute(url: URLStr): Promise<Page | undefined> {
        return DefaultMetadataEngine.createDefaultPage(url);
    }

    public static createDefaultPage(url: string): Page {

        return {
            title: "Document Repository",
            description: "A powerful document manager for Mac, Windows, and Linux for managing web content, books, and notes and supports tagging, annotation, highlighting and keeps track of your reading progress.",
            canonical: url,
            image: DEFAULT_IMG,
            card: 'summary',
        };

    }

}
