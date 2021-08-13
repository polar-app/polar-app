import {URLStr} from "polar-shared/src/util/Strings";
import {IBaseContent} from "./IBaseContent";

export type DataURLStr = string;

export interface IPlayerImage {

    readonly src: DataURLStr;

    readonly width: number;
    readonly height: number;

}

export interface IPlayerContent extends IBaseContent {

    readonly type: 'player';
    readonly image: IPlayerImage;
    readonly url: URLStr;

}
