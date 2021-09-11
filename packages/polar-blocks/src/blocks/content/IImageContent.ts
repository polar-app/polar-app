import {URLStr} from "polar-shared/src/util/Strings";
import {IBaseContent} from "./IBaseContent";

export type DataURLStr = string;

export interface IImageContent extends IBaseContent {

    readonly type: 'image';

    readonly src: DataURLStr | URLStr;

    readonly width: number;
    readonly height: number;

    readonly naturalWidth: number;
    readonly naturalHeight: number;

}
