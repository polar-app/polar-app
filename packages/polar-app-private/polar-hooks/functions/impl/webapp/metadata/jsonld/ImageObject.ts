import {BaseType, BaseTypeInit} from "./BaseType";
import {URLStr} from "polar-shared/src/util/Strings";

/**
 */
export interface IImageObjectInit extends BaseTypeInit {

    readonly url: URLStr;
    readonly width?: number;
    readonly height?: number;

}

export interface IImageObject extends IImageObjectInit, BaseType {


}


export class ImageObjects {

    public static create(init: IImageObjectInit): IImageObject {

        return {
            "@type": "ImageObject",
            ...init
        };

    }

}

export const DEFAULT_IMAGE_OBJECT = ImageObjects.create({
    url: 'https://getpolarized.io/assets/logo/icon.png',
    width: 512,
    height: 512
});
