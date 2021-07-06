import {URLStr} from "polar-shared/src/util/Strings";

export type DataURLStr = string;

export interface IImageContent {

    readonly type: 'image';

    readonly src: DataURLStr | URLStr;

    readonly width: number;
    readonly height: number;

    readonly naturalWidth: number;
    readonly naturalHeight: number;

}
