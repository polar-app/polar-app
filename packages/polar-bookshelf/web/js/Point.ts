export class Point {

    public readonly x: number;

    public readonly y: number;

    constructor(obj: IPoint) {

        this.x = obj.x;
        this.y = obj.y;

    }

}

export interface IPoint {

    readonly x: number;

    readonly y: number;

}
