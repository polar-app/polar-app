
export interface MutableILTRect {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
}

/**
 * A left/top rect.
 */
export interface ILTRect extends Readonly<MutableILTRect> {

}

