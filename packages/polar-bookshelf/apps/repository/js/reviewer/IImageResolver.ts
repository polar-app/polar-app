import {IImage} from "polar-shared/src/metadata/IImage";
import {Img} from "polar-shared/src/metadata/Img";

export type IImageResolver = (image: IImage) => Img | undefined;
