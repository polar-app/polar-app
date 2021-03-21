import {URLStr} from "polar-shared/src/util/Strings";
import {BaseType} from "./BaseType";

export interface ILogoInit {

    /**
     * The main URL to the site.
     */
    readonly url: URLStr;

    /**
     * The logo URL.
     */
    readonly logo: URLStr;

}

export interface ILogo extends ILogoInit, BaseType {


}

export class Logos {

    public static create(init: ILogoInit): ILogo {

        return {
            "@type": "Organization",
            ...init
        };

    }

}
