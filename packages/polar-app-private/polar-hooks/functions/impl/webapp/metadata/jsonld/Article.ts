import {BaseType, BaseTypeInit} from "./BaseType";
import {URLStr} from "polar-shared/src/util/Strings";
import {ILogo, ILogoInit} from "./Logo";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IPerson} from "./Person";
import {IOrganization} from "./Organization";
import {IImageObject, ImageObjects} from "./ImageObject";

/**
 * https://schema.org/Article
 * https://nystudio107.com/blog/annotated-json-ld-structured-data-examples
 * https://github.com/burtonator/polar-bookshelf/issues/1093
 */
export interface IArticleInit extends BaseTypeInit {

    readonly url: URLStr;

    readonly description: string;

    readonly headline?: string;

    readonly alternativeHeadline?: string;

    readonly author?: string | IPerson | IOrganization;

    readonly image?: URLStr | IImageObject,

    readonly publisher?: string | IPerson | IOrganization;

    readonly text?: string;

    readonly dateModified?: ISODateTimeString;

    readonly datePublished?: ISODateTimeString;

    /**
     * So if a web page is an article like the one you’re reading right now, it’ll have Article JSON-LD with the
     * mainEntityOfPage property’s value being the URL to the article itself
     */
    readonly mainEntityOfPage?: URLStr;

    readonly commentCount?: number;

}

export interface IArticle extends IArticleInit, BaseType {


}


export class Articles {

    public static create(init: IArticleInit): IArticle {

        return {
            "@type": "Article",
            ...init
        };

    }

}
