/**
 * Represents the progress of a state of tasks.
 */
export class Progress {

    private _value: number = 0;
    private _total: number;

    constructor(total: number) {
        if(! (total > 0)) {
            throw new Error("The total must be > 0");
        }
        this._total = total;
    }

    public incr() {
        ++this._value;
    }

    public value() {
        return this._value;
    }

    public total() {
        return this._total;
    }

    public percentage(): number {
        return 100 * (this._value / this._total);
    }

}
