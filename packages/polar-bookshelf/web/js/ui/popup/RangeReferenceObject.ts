import Popper from 'popper.js';

export class RangeReferenceObject implements Popper.ReferenceObject {

    public readonly clientHeight: number;
    public readonly clientWidth: number;
    private readonly range: Range;

    constructor(range: Range) {
        this.range = range;

        const boundingClientRect = range.getBoundingClientRect();

        this.clientHeight = boundingClientRect.height;
        this.clientWidth = boundingClientRect.width;
    }

    public getBoundingClientRect(): ClientRect {
        return this.range.getBoundingClientRect();
    }

}
