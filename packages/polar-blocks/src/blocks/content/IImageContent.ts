import {URLStr} from "polar-shared/src/util/Strings";
import {IBaseContent} from "./IBaseContent";
import {IHasLinksContent} from "./IHasLinksContent";

export type DataURLStr = string;

export interface IImageContent extends IBaseContent, IHasLinksContent {

    readonly type: 'image';

    readonly src: DataURLStr | URLStr;

    readonly width: number;
    readonly height: number;

    readonly naturalWidth: number;
    readonly naturalHeight: number;

}
