import {BaseType} from "./BaseType";
import {URLStr} from "polar-shared/src/util/Strings";
import {ILogo, ILogoInit} from "./Logo";

/**
 * https://schema.org/WebPage
 * https://nystudio107.com/blog/annotated-json-ld-structured-data-examples
 */
export interface IWebPageInit {

    readonly name: string;
    readonly description: string;
    readonly publisher?: string;

    /**
     * So if a web page is an article like the one you’re reading right now, it’ll have Article JSON-LD with the
     * mainEntityOfPage property’s value being the URL to the article itself
     */
    readonly mainEntityOfPage?: URLStr;

}

export interface IWebPage extends IWebPageInit, BaseType {


}


export class WebPages {

    public static create(init: ILogoInit): ILogo {

        return {
            "@type": "WebPage",
            ...init
        };

    }

}
