export type DataURLStr = string;

export interface IImageContent {
    readonly type: 'name';
    readonly src: DataURLStr;
}
