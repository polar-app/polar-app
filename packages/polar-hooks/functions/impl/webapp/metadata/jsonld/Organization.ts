import {BaseType, BaseTypeInit} from "./BaseType";
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
