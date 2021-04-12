import {URLStr} from "polar-shared/src/util/Strings";

export type DataURLStr = string;

export interface IPlayerImage {

    readonly src: DataURLStr;

    readonly width: number;
    readonly height: number;

}

export interface IPlayerContent {

    readonly type: 'player';
    readonly image: IPlayerImage;
    readonly url: URLStr;

}
