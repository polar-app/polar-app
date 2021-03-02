import {BaseType, BaseTypeInit} from "./BaseType";
import {URLStr} from "polar-shared/src/util/Strings";
import {ILogo, ILogoInit} from "./Logo";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IPerson} from "./Person";
import {DEFAULT_IMAGE_OBJECT, IImageObject} from "./ImageObject";

/**
 */
export interface IOrganizationInit extends BaseTypeInit {

    readonly name: string;
    readonly logo?: IImageObject

}

export interface IOrganization extends IOrganizationInit, BaseType {


}


export class Organizations {

    public static create(init: IOrganizationInit): IOrganization {

        return {
            "@type": "Organization",
            ...init
        };

    }

}

export const DEFAULT_PUBLISHER = Organizations.create({
    name: "Polar",
    logo: DEFAULT_IMAGE_OBJECT
});
