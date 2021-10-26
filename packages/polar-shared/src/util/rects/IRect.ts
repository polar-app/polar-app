export interface MutableIRect {
    readonly top: number;
    readonly bottom: number;
    readonly left: number;
    readonly right: number;
    readonly width: number;
    readonly height: number;
}

export interface IRect extends Readonly<MutableIRect> {
}
