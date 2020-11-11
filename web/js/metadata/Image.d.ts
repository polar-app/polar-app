import { SerializedObject } from './SerializedObject';
import { IImage, ImageType } from "polar-shared/src/metadata/IImage";
import { BackendFileRef } from "polar-shared/src/datastore/BackendFileRef";
export declare class Image extends SerializedObject implements IImage {
    readonly id: string;
    readonly type: ImageType;
    readonly src: BackendFileRef;
    readonly width?: number;
    readonly height?: number;
    readonly rel?: string;
    constructor(opts: IImage);
    validate(): void;
}
export interface ImageOpts {
    readonly width?: number;
    readonly height?: number;
    readonly rel?: string;
    readonly type?: ImageType;
}
export declare enum ImageTypes {
    GIF = "image/gif",
    PNG = "image/png",
    JPEG = "image/jpeg",
    WEBP = "image/webp",
    SVG = "image/svg+xml"
}
