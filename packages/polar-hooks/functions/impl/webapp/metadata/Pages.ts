import { URLStr } from "polar-shared/src/util/Strings";
import {IArticle} from "./jsonld/Article";
import {IComment} from "./jsonld/Comment";
import {IImageObject} from "./jsonld/ImageObject";

export type CardType = 'summary' | 'summary_large_image';

export interface Page {

    readonly title: string;

    readonly description?: string;

    readonly canonical: URLStr;

    readonly card: CardType;

    readonly image: IImageObject;

    /**
     * The posts for this page that should also have metadata.  Should be JSON-ld compatible metadata
     * which we can use for SEO.
     */
    readonly posts?: ReadonlyArray<Post>;

    // TODO: lastUpdated and created values should specified ideally...

    readonly article?: IArticle;

    readonly comments?: ReadonlyArray<IComment>;

}

export type PostType = 'comment' | 'text-highlight' | 'area-highlight';

export interface Post {

    readonly type: PostType;

    readonly title: string;

    readonly description?: string;

    readonly link?: string;

}
