export type DataURLStr = string;

export interface IImageContent {

    readonly type: 'image';
    readonly src: DataURLStr;

    readonly width: number;
    readonly height: number;

    readonly naturalWidth: number;
    readonly naturalHeight: number;

}
